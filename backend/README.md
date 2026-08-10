# Caritas University Chatbot — Backend

Flask + SQLite + scikit-learn (TF-IDF intent matching) + Groq (LLM fallback).

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # then paste your real Groq API key into .env
python seed_data.py        # creates + seeds caritas_chatbot.db
python app.py              # runs on http://localhost:5000
```

Get a free Groq API key at https://console.groq.com/keys

## How answering works

1. Incoming message is normalized and matched via TF-IDF + cosine
   similarity against every training phrase and FAQ question in the DB
   (`ml_engine.py`).
2. If the best match's confidence >= `CONFIDENCE_THRESHOLD` (0.30), the
   stored FAQ answer is returned directly — fast, free, deterministic.
3. If confidence is below that, the message is sent to Groq
   (`groq_service.py`) along with the top 3 near-miss FAQ answers as
   light grounding context, so the model prefers real school facts over
   guessing.
4. Every low-confidence query is logged to `unresolved_queries` — review
   these periodically and turn recurring ones into new FAQs/training
   phrases in `seed_data.py`, then re-run it. That's the "retraining loop".

## Expanding the knowledge base

Edit `INTENTS` in `seed_data.py` — add more training phrases per intent
(the more varied phrasings, the better the matcher gets) or add whole new
intents/FAQs. Re-run `python seed_data.py` to rebuild.

## API

- `POST /api/session` → `{ session_id }`
- `POST /api/chat` `{ message, session_id }` → `{ reply, matched_intent, confidence, source }`
- `GET /api/chat/history/<session_id>`
- `GET /api/departments`
- `GET /api/faqs`
- `GET /api/quick-topics`
