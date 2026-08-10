import os
import uuid

from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS

from models import db, Department, FAQ, Intent, TrainingPhrase, ChatSession, ChatMessage, UnresolvedQuery
from ml_engine import matcher, build_corpus_from_db, normalize, CONFIDENCE_THRESHOLD

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'caritas_chatbot.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", "dev-secret")

CORS(app)  # dev-friendly; lock this down to your frontend origin in production
db.init_app(app)


def refit_matcher():
    with app.app_context():
        corpus = build_corpus_from_db(db.session, Intent, TrainingPhrase, FAQ)
        matcher.fit(corpus)


GREETING_INTENTS = {"greeting", "thanks", "goodbye"}


def get_followup_suggestions(matched_intent: str | None) -> list[str]:
    """Generates 3-4 smart, topic-aware follow-up suggestions based on the matched intent."""
    SUGGESTION_MAP = {
        "greeting": [
            "What are the admission requirements?",
            "How much is the school fees?",
            "Is hostel accommodation available?",
            "What departments do you offer?",
        ],
        "admission_requirements": [
            "What is the JAMB cut-off mark?",
            "Does Caritas accept Direct Entry?",
            "How much is the acceptance fee?",
            "What documents are needed for physical clearance?",
        ],
        "jamb_cutoff": [
            "What are the admission requirements?",
            "What departments do you offer?",
            "How do I apply for Post-UTME?",
            "How much is school fees?",
        ],
        "direct_entry": [
            "What are the O'Level requirements?",
            "How much is acceptance fee?",
            "When does registration close?",
            "Is hostel accommodation available?",
        ],
        "school_fees": [
            "How much is the acceptance fee?",
            "Can I pay school fees in installments?",
            "How much is hostel accommodation?",
            "Are there academic scholarships?",
        ],
        "acceptance_fee": [
            "How much is school fees?",
            "How do I log into the portal?",
            "What documents are needed for clearance?",
            "How do I get a hostel room?",
        ],
        "hostel_accommodation": [
            "What items are allowed in the hostel?",
            "How much is school fees?",
            "What is the hostel curfew time?",
            "Where is Student Affairs office located?",
        ],
        "hostel_rules": [
            "Is accommodation compulsory for 100 level?",
            "Where is the campus clinic?",
            "What are the library opening hours?",
        ],
        "portal_help": [
            "How do I register my courses?",
            "How do I check my semester result?",
            "Where is the ICT helpdesk located?",
            "How much is school fees?",
        ],
        "course_registration": [
            "What is the deadline for course registration?",
            "I can't log into the portal",
            "When do exams start?",
        ],
        "exams_results": [
            "What do I need to bring to the exam hall?",
            "How do I report a missing result?",
            "How do I request an academic transcript?",
        ],
        "exam_rules": [
            "When are exams starting?",
            "How do I check my semester result?",
            "How do I register courses?",
        ],
        "clearance_procedure": [
            "What documents are needed for fresh clearance?",
            "How do I pay acceptance fee?",
            "How do I get mobilized for NYSC?",
        ],
        "transcript_request": [
            "How do I request an academic transcript?",
            "How do I get mobilized for NYSC?",
            "Where is Exams and Records office?",
        ],
        "nysc_mobilization": [
            "How do I check the Senate graduating list?",
            "How do I request an academic transcript?",
            "What is the final clearance procedure?",
        ],
        "departments_info": [
            "What is the JAMB cut-off for Computer Science?",
            "Does Caritas offer Law?",
            "Does Caritas offer Nursing Science?",
            "What are the admission requirements?",
        ],
        "location_contact": [
            "How do I get to Amorji-Nike Enugu?",
            "What is the Student Affairs phone number?",
            "What are the admission requirements?",
        ],
        "library_services": [
            "What are the library opening hours?",
            "How do I register for a library card?",
            "Where is the ICT center?",
        ],
        "medical_center": [
            "What is the medical screening procedure?",
            "Where is the school clinic located?",
            "Is hostel accommodation compulsory?",
        ],
        "scholarships_aid": [
            "What CGPA is required for VC scholarship?",
            "How much is school fees?",
            "Where is Bursary office located?",
        ],
    }
    
    if matched_intent and matched_intent in SUGGESTION_MAP:
        return SUGGESTION_MAP[matched_intent]

    # Default general smart suggestions
    return [
        "What are the admission requirements?",
        "How much is the school fees?",
        "Is hostel accommodation available?",
        "What departments do you offer?",
    ]


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/session", methods=["POST"])
def create_session():
    session_id = str(uuid.uuid4())
    db.session.add(ChatSession(id=session_id))
    db.session.commit()
    return jsonify({"session_id": session_id})


@app.route("/api/departments", methods=["GET"])
def list_departments():
    depts = Department.query.order_by(Department.name).all()
    return jsonify([d.to_dict() for d in depts])


@app.route("/api/faqs", methods=["GET"])
def list_faqs():
    category = request.args.get("category")
    search = request.args.get("search")
    
    query = FAQ.query
    if search:
        query = query.filter(FAQ.question.ilike(f"%{search}%") | FAQ.answer.ilike(f"%{search}%"))
    
    faqs = query.all()
    
    # Filter by intent category if specified
    if category and category.lower() != "all":
        faqs = [f for f in faqs if f.intent and f.intent.category and f.intent.category.lower() == category.lower()]
        
    return jsonify([f.to_dict() for f in faqs])


@app.route("/api/quick-topics", methods=["GET"])
def quick_topics():
    """A handful of suggested chips shown on first load."""
    topics = [
        {"label": "Admission requirements", "message": "What are the admission requirements?"},
        {"label": "JAMB Cut-off Mark", "message": "What is the JAMB cut-off mark for my course?"},
        {"label": "School Fees & Installments", "message": "How much is the school fees?"},
        {"label": "Hostel Accommodation", "message": "Is there hostel accommodation available?"},
        {"label": "Departments & Faculties", "message": "What departments do you have at Caritas?"},
        {"label": "Student Portal Help", "message": "I can't log into the portal"},
    ]
    return jsonify(topics)


@app.route("/api/tools/estimate-fees", methods=["POST"])
def estimate_fees():
    """Interactive fee calculator helper."""
    data = request.get_json(force=True) or {}
    faculty = data.get("faculty", "Natural and Applied Sciences")
    level = int(data.get("level", 100))
    include_hostel = bool(data.get("include_hostel", True))

    base_tuition = 380000
    if "Health" in faculty or "Law" in faculty:
        base_tuition = 520000
    elif "Engineering" in faculty or "Environmental" in faculty:
        base_tuition = 440000

    acceptance_fee = 50000 if level == 100 else 0
    hostel_fee = 90000 if include_hostel else 0
    ict_dev_fee = 25000

    total = base_tuition + acceptance_fee + hostel_fee + ict_dev_fee
    first_installment = int(total * 0.6)
    second_installment = total - first_installment

    return jsonify({
        "faculty": faculty,
        "level": level,
        "base_tuition": base_tuition,
        "acceptance_fee": acceptance_fee,
        "hostel_fee": hostel_fee,
        "ict_dev_fee": ict_dev_fee,
        "total_estimated": total,
        "installment_plan": {
            "first_semester": first_installment,
            "second_semester": second_installment
        }
    })


@app.route("/api/chat/history/<session_id>", methods=["GET"])
def chat_history(session_id):
    session = ChatSession.query.get(session_id)
    if not session:
        return jsonify([])
    return jsonify([m.to_dict() for m in session.messages])


def resolve_smart_answer(message: str) -> tuple[str | None, str | None]:
    """Extracts department names, cut-off mark inquiries, scores, and fee questions to return precise answers."""
    import re
    msg_lower = message.lower().strip()
    
    depts_map = {
        "computer science": {
            "name": "B.Sc. Computer Science",
            "faculty": "Faculty of Natural and Applied Sciences",
            "cutoff": 140,
            "olevel": "5 Credits in English Language, Mathematics, Physics, Chemistry, and Biology or Further Mathematics at max 2 sittings.",
            "fee": "N380,000 per session",
        },
        "accounting": {
            "name": "B.Sc. Accounting",
            "faculty": "Faculty of Management and Social Sciences",
            "cutoff": 140,
            "olevel": "5 Credits in English Language, Mathematics, Economics, Financial Accounting/Commerce, and any Social Science subject at max 2 sittings.",
            "fee": "N350,000 per session (ICAN & ANAN accredited)",
        },
        "law": {
            "name": "LL.B. Law",
            "faculty": "Faculty of Law",
            "cutoff": 180,
            "olevel": "5 Credits in English Literature, English Language, Mathematics, Government/History, and CRK/IRS at 1 sitting.",
            "fee": "N520,000 per session",
        },
        "nursing": {
            "name": "B.N.Sc. Nursing Science",
            "faculty": "Faculty of Health Sciences",
            "cutoff": 180,
            "olevel": "5 Credits in English Language, Mathematics, Physics, Chemistry, and Biology at 1 sitting.",
            "fee": "N520,000 per session",
        },
        "mass communication": {
            "name": "B.Sc. Mass Communication",
            "faculty": "Faculty of Management and Social Sciences",
            "cutoff": 140,
            "olevel": "5 Credits in English Language, Mathematics, Literature in English, and 2 Social Science/Arts subjects.",
            "fee": "N350,000 per session",
        },
        "microbiology": {
            "name": "B.Sc. Microbiology",
            "faculty": "Faculty of Natural and Applied Sciences",
            "cutoff": 140,
            "olevel": "5 Credits in English, Maths, Biology, Chemistry, and Physics.",
            "fee": "N380,000 per session",
        },
        "economics": {
            "name": "B.Sc. Economics",
            "faculty": "Faculty of Management and Social Sciences",
            "cutoff": 140,
            "olevel": "5 Credits in English, Maths, Economics, and 2 Social Science subjects.",
            "fee": "N350,000 per session",
        },
        "engineering": {
            "name": "B.Eng. Engineering (Electrical / Mechanical)",
            "faculty": "Faculty of Engineering",
            "cutoff": 160,
            "olevel": "5 Credits in English, Maths, Physics, Chemistry, and Further Maths/Technical Drawing.",
            "fee": "N440,000 per session",
        },
        "architecture": {
            "name": "B.Sc. Architecture",
            "faculty": "Faculty of Environmental Sciences",
            "cutoff": 140,
            "olevel": "5 Credits in English, Maths, Physics, Fine Arts/Technical Drawing, and Geography/Chemistry.",
            "fee": "N440,000 per session",
        },
    }

    # Extract score numbers if present (e.g. 243, 180, 160)
    scores = [int(s) for s in re.findall(r'\b\d{3}\b', msg_lower)]
    user_score = scores[0] if scores else None

    # Check for matched department
    matched_dept_key = None
    for key in depts_map:
        if key in msg_lower:
            matched_dept_key = key
            break

    if matched_dept_key:
        info = depts_map[matched_dept_key]
        score_eval = ""
        if user_score:
            if user_score >= info["cutoff"]:
                score_eval = f"\n- Your JAMB Score ({user_score}): Qualified! Your score of {user_score} is well above the required {info['cutoff']} cut-off mark."
            else:
                score_eval = f"\n- Your JAMB Score ({user_score}): Below cut-off. {info['name']} requires a minimum JAMB score of {info['cutoff']}."

        reply = (
            f"Here are the exact details for {info['name']} ({info['faculty']}):\n"
            f"- JAMB Cut-off Mark: {info['cutoff']} minimum.{score_eval}\n"
            f"- O'Level Requirements: {info['olevel']}\n"
            f"- Estimated Tuition & Fees: {info['fee']}\n"
            f"- Post-UTME Screening: Register online at portal.caritasuni.edu.ng."
        )
        return reply, "departments_info"

    # 2. General Cut-off mark query
    if any(phrase in msg_lower for phrase in ["cut off", "cutoff", "cut-off", "jamb mark", "minimum score"]):
        reply = (
            "Caritas University official JAMB Cut-off Marks:\n"
            "- General University Minimum Cut-off: 140\n"
            "- Law (LL.B): 180 minimum\n"
            "- Nursing Science (B.N.Sc): 180 minimum\n"
            "- Engineering (Electrical/Mechanical): 160 minimum\n"
            "- Computer Science, Microbiology, Architecture: 140 minimum\n"
            "- Management & Social Sciences (Accounting, Mass Comm, Economics): 140 minimum\n\n"
            "Candidates scoring 140+ in UTME are eligible to apply for Post-UTME screening on the portal."
        )
        return reply, "jamb_cutoff"

    # 3. School fees query
    if any(phrase in msg_lower for phrase in ["school fee", "tuition", "how much is fees", "fees breakdown", "acceptance fee"]):
        reply = (
            "Caritas University Tuition & Fees Breakdown:\n"
            "- Health Sciences & Law: ~N520,000 per session\n"
            "- Engineering & Architecture: ~N440,000 per session\n"
            "- Computer Science & Applied Sciences: ~N380,000 per session\n"
            "- Management & Social Sciences (Accounting, Mass Comm): ~N350,000 per session\n"
            "- Acceptance Fee (New Students): N50,000 (One-time)\n"
            "- Hostel Accommodation: N80,000 - N120,000 per session\n\n"
            "Payment Plan: Installment payments (60% first semester, 40% second semester) are permitted upon Bursary approval."
        )
        return reply, "school_fees"

    return None, None



@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True) or {}
    message = (data.get("message") or "").strip()
    session_id = data.get("session_id")

    if not message:
        return jsonify({"error": "message is required"}), 400

    # ensure session exists
    session = ChatSession.query.get(session_id) if session_id else None
    if not session:
        session_id = str(uuid.uuid4())
        session = ChatSession(id=session_id)
        db.session.add(session)
        db.session.commit()

    db.session.add(ChatMessage(session_id=session_id, sender="user", text=message))
    db.session.commit()

    # Step 1: Check smart entity resolver first for high precision
    smart_reply, smart_intent = resolve_smart_answer(message)

    if smart_reply:
        reply_text = smart_reply
        matched_intent = smart_intent
        confidence = 1.0
        source = "smart_resolver"
    else:
        # Step 2: TF-IDF matcher
        result = matcher.match(message)
        matched_intent = result.intent_tag
        confidence = round(result.confidence, 3)

        if result.confidence >= CONFIDENCE_THRESHOLD and result.answer:
            reply_text = result.answer
            source = "kb"
        else:
            # Step 3: Fallback handling
            try:
                from groq_service import generate_answer
                near_misses = [r.answer for r in matcher.top_k(message, k=3) if r.answer]
                reply_text = generate_answer(message, context_snippets=near_misses)
                source = "groq"
            except Exception:
                reply_text = (
                    "Caritas University offers 5 O'Level credit admission requirements, JAMB cut-off 140 (Law/Nursing 180), "
                    "on-campus hostels (N80,000-N120,000), and portal course registration. You can ask me about specific courses, fees, or clearance!"
                )
                source = "fallback"

            db.session.add(
                UnresolvedQuery(text=message, best_guess_intent=matched_intent, confidence=confidence)
            )

    # Compute dynamic follow-up suggestions
    suggestions = get_followup_suggestions(matched_intent)

    db.session.add(
        ChatMessage(
            session_id=session_id,
            sender="bot",
            text=reply_text,
            matched_intent=matched_intent,
            confidence=confidence,
            source=source,
        )
    )
    db.session.commit()

    return jsonify(
        {
            "session_id": session_id,
            "reply": reply_text,
            "matched_intent": matched_intent,
            "confidence": confidence,
            "source": source,
            "suggestions": suggestions,
        }
    )


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        refit_matcher()
    app.run(debug=True, port=5000)
else:
    # also refit when imported by seed_data.py / gunicorn etc.
    with app.app_context():
        db.create_all()
        refit_matcher()
