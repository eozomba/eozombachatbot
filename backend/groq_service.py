"""
Tier 2 of the chatbot: Groq-hosted LLM, used only when the TF-IDF/cosine
matcher (ml_engine.py) isn't confident about an answer.

Kept as a thin wrapper so the rest of the app doesn't care which LLM
vendor is behind it — swapping providers later only touches this file.
"""
import os
from groq import Groq

_client = None


def get_client() -> Groq:
    global _client
    if _client is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env (see .env.example)."
            )
        _client = Groq(api_key=api_key)
    return _client


SYSTEM_PROMPT = """You are the official enquiry assistant for Caritas University, \
Amorji-Nike, Enugu, Nigeria. Motto: "Love for Education and Morals."

Rules:
- Only answer questions related to the university: admissions, courses, \
departments, fees, hostel/accommodation, exams, portal/registration, \
school life, contact/location.
- If a question is outside that scope (general knowledge, unrelated topics), \
politely say you can only help with Caritas University enquiries.
- If you don't have a specific fact (e.g. an exact fee figure or date), say \
so plainly and direct the student to the Student Affairs office or the \
official school portal instead of guessing.
- Keep answers short — 2 to 4 sentences. No markdown, no headers, no emoji \
spam. Plain, direct, human tone, like a helpful admin staff member.
"""


def generate_answer(user_message: str, context_snippets: list[str] | None = None) -> str:
    """
    context_snippets: optional short list of near-miss FAQ answers from the
    TF-IDF matcher, passed in as extra grounding context (basic RAG) so the
    LLM prefers real school info over guessing.
    """
    client = get_client()
    model = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

    context_block = ""
    if context_snippets:
        joined = "\n".join(f"- {c}" for c in context_snippets if c)
        if joined:
            context_block = (
                "\n\nHere are possibly-related facts from the school's FAQ "
                f"database (use only if relevant, ignore if not):\n{joined}"
            )

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT + context_block},
            {"role": "user", "content": user_message},
        ],
        temperature=0.4,
        max_tokens=300,
    )
    return completion.choices[0].message.content.strip()
