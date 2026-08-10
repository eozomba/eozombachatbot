"""
Database models for Caritas University Enquiry Chatbot.
Kept intentionally simple (SQLite) for a final-year project scope,
but structured so it maps cleanly onto Postgres/MySQL later if needed.
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Department(db.Model):
    __tablename__ = "departments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    faculty = db.Column(db.String(150), nullable=True)
    description = db.Column(db.Text, nullable=True)

    faqs = db.relationship("FAQ", backref="department", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "faculty": self.faculty,
            "description": self.description,
        }


class Intent(db.Model):
    """
    A named intent/topic, e.g. 'admission_requirements', 'school_fees'.
    Each intent has many training phrases (used to fit the ML matcher)
    and one canonical answer (or a template answer).
    """
    __tablename__ = "intents"

    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(100), nullable=False, unique=True)
    category = db.Column(db.String(80), nullable=True)  # admissions, fees, hostel, exams, etc.

    training_phrases = db.relationship(
        "TrainingPhrase", backref="intent", lazy=True, cascade="all, delete-orphan"
    )
    faqs = db.relationship("FAQ", backref="intent", lazy=True)


class TrainingPhrase(db.Model):
    """Example user utterances mapped to an intent — this is the 'ML training data'."""
    __tablename__ = "training_phrases"

    id = db.Column(db.Integer, primary_key=True)
    intent_id = db.Column(db.Integer, db.ForeignKey("intents.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)


class FAQ(db.Model):
    __tablename__ = "faqs"

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey("departments.id"), nullable=True)
    intent_id = db.Column(db.Integer, db.ForeignKey("intents.id"), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "department": self.department.name if self.department else None,
        }


class ChatSession(db.Model):
    __tablename__ = "chat_sessions"

    id = db.Column(db.String(64), primary_key=True)  # uuid
    started_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship("ChatMessage", backref="session", lazy=True, cascade="all, delete-orphan")


class ChatMessage(db.Model):
    __tablename__ = "chat_messages"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(64), db.ForeignKey("chat_sessions.id"), nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # 'user' | 'bot'
    text = db.Column(db.Text, nullable=False)
    matched_intent = db.Column(db.String(100), nullable=True)
    confidence = db.Column(db.Float, nullable=True)
    source = db.Column(db.String(20), nullable=True)  # 'kb' | 'groq' | 'fallback'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "text": self.text,
            "matched_intent": self.matched_intent,
            "confidence": self.confidence,
            "source": self.source,
            "created_at": self.created_at.isoformat(),
        }


class UnresolvedQuery(db.Model):
    """
    Logs low-confidence queries so the admin can review them and turn
    recurring ones into new FAQs/training phrases — the 'retraining loop'.
    """
    __tablename__ = "unresolved_queries"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    best_guess_intent = db.Column(db.String(100), nullable=True)
    confidence = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved = db.Column(db.Boolean, default=False)
