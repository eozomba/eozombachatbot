"""
ML Engine — the logic that powers the chatbot "under the hood".

Design choice, and why (worth stating explicitly in your project report):
-----------------------------------------------------------------------
A campus enquiry bot has a mostly-closed set of recurring questions
(admissions, fees, hostel, exams, portal issues, department info).
For that kind of *closed-domain FAQ retrieval*, a large generative model
is overkill, slower, and less predictable than a classic ML text-matching
pipeline. So the architecture is a two-tier "retrieval-augmented" design:

  Tier 1 (this file): TF-IDF vectorization + cosine similarity over a
  bank of known intents/training phrases + FAQ questions. This is fast,
  explainable, runs fully offline, costs nothing per request, and is the
  textbook approach for FAQ/intent-matching chatbots (same family of
  technique used by Rasa's TF-IDF featurizer and classic scikit-learn
  text classification pipelines).

  Tier 2 (groq_service.py): only invoked when Tier 1's confidence is
  below a threshold, i.e. the question doesn't clearly match anything in
  the knowledge base. Groq (Llama 3.1) then generates a free-form,
  university-context-aware answer, or asks a clarifying question.

This keeps the bot fast and deterministic for the 80% of questions that
are FAQs, and only pays the latency/cost of an LLM call for the long tail.
"""
import re
import string
from dataclasses import dataclass

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CONFIDENCE_THRESHOLD = 0.30  # below this, Tier 1 defers to Groq

_PUNCT_TABLE = str.maketrans("", "", string.punctuation)

# Small, hand-picked stopword list — kept local so we don't need an nltk
# download at runtime (this app has to run offline for a demo/defense).
_STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
    "i", "you", "he", "she", "it", "we", "they", "my", "your", "his",
    "her", "its", "our", "their", "to", "of", "in", "on", "for", "and",
    "or", "but", "with", "at", "by", "from", "about", "as", "into",
    "please", "kindly", "can", "could", "would", "should", "will",
}


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = text.translate(_PUNCT_TABLE)
    text = re.sub(r"\s+", " ", text)
    tokens = [t for t in text.split() if t not in _STOPWORDS]
    return " ".join(tokens) if tokens else text


@dataclass
class MatchResult:
    intent_tag: str | None
    confidence: float
    faq_id: int | None
    answer: str | None


class IntentMatcher:
    """
    Fits a TF-IDF space over ALL training phrases + FAQ questions in the DB,
    then matches an incoming message by cosine similarity.

    Call `fit(corpus)` once at startup (and again after admin edits the KB).
    `corpus` is a list of dicts: {text, intent_tag, faq_id, answer}
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            preprocessor=normalize,
            ngram_range=(1, 2),
            min_df=1,
        )
        self._matrix = None
        self._corpus = []  # aligned with matrix rows

    def fit(self, corpus: list[dict]):
        self._corpus = corpus
        texts = [row["text"] for row in corpus]
        if not texts:
            self._matrix = None
            return
        self._matrix = self.vectorizer.fit_transform(texts)

    def match(self, message: str) -> MatchResult:
        if self._matrix is None or not self._corpus:
            return MatchResult(None, 0.0, None, None)

        query_vec = self.vectorizer.transform([message])
        sims = cosine_similarity(query_vec, self._matrix)[0]
        best_idx = sims.argmax()
        best_score = float(sims[best_idx])
        best_row = self._corpus[best_idx]

        return MatchResult(
            intent_tag=best_row.get("intent_tag"),
            confidence=best_score,
            faq_id=best_row.get("faq_id"),
            answer=best_row.get("answer"),
        )

    def top_k(self, message: str, k: int = 3) -> list[MatchResult]:
        if self._matrix is None or not self._corpus:
            return []
        query_vec = self.vectorizer.transform([message])
        sims = cosine_similarity(query_vec, self._matrix)[0]
        ranked = sims.argsort()[::-1][:k]
        results = []
        for idx in ranked:
            row = self._corpus[idx]
            results.append(
                MatchResult(
                    intent_tag=row.get("intent_tag"),
                    confidence=float(sims[idx]),
                    faq_id=row.get("faq_id"),
                    answer=row.get("answer"),
                )
            )
        return results


# Singleton instance shared across the Flask app
matcher = IntentMatcher()


def build_corpus_from_db(db_session, Intent, TrainingPhrase, FAQ) -> list[dict]:
    """
    Pulls every training phrase and every FAQ question out of the DB and
    turns it into flat (text -> intent/faq/answer) rows for the vectorizer.
    Both training phrases AND FAQ questions themselves are used as
    positive examples — more signal, better matching with a small dataset.
    """
    corpus = []

    for intent in Intent.query.all():
        for phrase in intent.training_phrases:
            # an intent's canonical answer, if any single FAQ is attached
            answer = intent.faqs[0].answer if intent.faqs else None
            faq_id = intent.faqs[0].id if intent.faqs else None
            corpus.append(
                {
                    "text": phrase.text,
                    "intent_tag": intent.tag,
                    "faq_id": faq_id,
                    "answer": answer,
                }
            )

    for faq in FAQ.query.all():
        corpus.append(
            {
                "text": faq.question,
                "intent_tag": faq.intent.tag if faq.intent else None,
                "faq_id": faq.id,
                "answer": faq.answer,
            }
        )

    return corpus
