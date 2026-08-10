"""
Seeds the SQLite DB with starter Caritas University content.
Edit/expand this freely — it's your knowledge base. Re-run with
`python seed_data.py` any time (it wipes and rebuilds).
"""
from app import app, refit_matcher
from models import db, Department, Intent, TrainingPhrase, FAQ

DEPARTMENTS = [
    ("Computer Science", "Faculty of Natural and Applied Sciences", "B.Sc. Computer Science, focusing on Software Engineering, AI, Cyber Security, and Networking."),
    ("Mass Communication", "Faculty of Management and Social Sciences", "B.Sc. Mass Communication, focusing on Print/Digital Journalism, Broadcasting, and Public Relations."),
    ("Accounting", "Faculty of Management and Social Sciences", "B.Sc. Accounting, accredited by ICAN and ANAN, covering Financial Accounting, Auditing, and Taxation."),
    ("Law", "Faculty of Law", "LL.B. Law, accredited by Council of Legal Education, preparing students for Nigerian Law School."),
    ("Nursing Science", "Faculty of Health Sciences", "B.N.Sc. Nursing Science, registered with Nursing and Midwifery Council of Nigeria."),
    ("Microbiology", "Faculty of Natural and Applied Sciences", "B.Sc. Microbiology, specializing in Medical, Industrial, and Environmental Microbiology."),
    ("Economics", "Faculty of Management and Social Sciences", "B.Sc. Economics, covering Econometrics, Development Economics, and Financial Markets."),
    ("Political Science", "Faculty of Management and Social Sciences", "B.Sc. Political Science, covering International Relations, Public Administration, and Governance."),
    ("Biochemistry", "Faculty of Natural and Applied Sciences", "B.Sc. Biochemistry, studying Molecular Biology, Clinical Chemistry, and Biotechnology."),
    ("Architecture", "Faculty of Environmental Sciences", "B.Sc. Architecture, accredited by ARCON and NIA for spatial design and building technology."),
    ("Electrical/Electronics Engineering", "Faculty of Engineering", "B.Eng. Electrical & Electronics Engineering, COREN accredited."),
    ("Mechanical Engineering", "Faculty of Engineering", "B.Eng. Mechanical Engineering, focusing on Thermo-fluids, CAD, and Robotics."),
]

# Each entry: intent_tag, category, [training phrases], answer, department_name(optional)
INTENTS = [
    (
        "greeting", "general",
        ["hello", "hi", "good morning", "good afternoon", "hey there", "hi there", "greetings"],
        "Hello! Welcome to the Caritas University enquiry assistant. I am here to help you with admissions, fees, hostel lodging, departments, portal assistance, exam rules, and campus services. What would you like to know today?",
        None,
    ),
    (
        "admission_requirements", "admissions",
        [
            "what are the admission requirements",
            "how do I get admitted to caritas university",
            "what do I need to apply",
            "utme requirements for caritas university",
            "post utme requirements",
            "what subjects do I need for computer science",
            "how can I apply to caritas university",
            "o level credits for admission",
        ],
        "Caritas University admission requires 5 O'Level credit passes (WAEC/NECO/NABTEB) including English Language and Mathematics at not more than two sittings, a valid JAMB UTME score meeting the departmental cutoff, and completion of the online Post-UTME screening on the university portal.",
        None,
    ),
    (
        "jamb_cutoff", "admissions",
        [
            "what is the jamb cut off mark",
            "cutoff mark for nursing",
            "cutoff mark for law",
            "cutoff mark for computer science",
            "minimum jamb score required",
            "jamb cut off for caritas",
        ],
        "The general minimum JAMB cut-off mark for Caritas University is 140. However, competitive programs like Law (180+), Nursing Science (180+), and Engineering (160+) have higher departmental cut-off requirements. Candidates who chose Caritas as 1st or 2nd choice or did a JAMB change of institution are eligible.",
        None,
    ),
    (
        "direct_entry", "admissions",
        [
            "does caritas accept direct entry",
            "direct entry requirements",
            "how to apply for 200 level admission",
            "de admission process",
            "jupeb or ijmb transfer to caritas",
        ],
        "Yes! Caritas University accepts Direct Entry (DE) applicants into 200 Level. Candidates must possess JUPEB, IJMB, NCE, OND/HND with minimum Upper Credit in relevant disciplines, plus 5 O'Level credits. Apply through JAMB DE and register on the Caritas portal.",
        None,
    ),
    (
        "school_fees", "fees",
        [
            "how much is school fees",
            "what is the tuition fee",
            "school fees for new students",
            "fees for returning students",
            "how much is acceptance fee",
            "payment plan for tuition",
            "can I pay school fees in installments",
        ],
        "School fees range depending on your program and level (Freshmen vs Returning students). For instance, Health Sciences & Law fees range between N450,000 - N650,000 per session, while Management & Sciences range from N350,000 - N500,000. Flexible two-installment payment options are available upon Bursary approval.",
        None,
    ),
    (
        "acceptance_fee", "fees",
        [
            "how much is the acceptance fee",
            "how do I pay acceptance fee",
            "is acceptance fee refundable",
            "acceptance fee deadline",
        ],
        "The non-refundable acceptance fee for newly admitted students is N50,000. Payment must be made online via the official portal within 2 weeks of receiving the provisional admission letter to secure your seat.",
        None,
    ),
    (
        "hostel_accommodation", "hostel",
        [
            "is there hostel accommodation",
            "how do I get a hostel room",
            "school hostel fees",
            "is accommodation compulsory for 100 level",
            "off campus or on campus hostel",
            "how much is hostel fee",
        ],
        "On-campus hostel accommodation is compulsory for 100 Level students and optional for higher levels based on availability. Hostel fees range from N80,000 to N120,000 per session depending on hall type (Standard vs Executive). Rooms are reserved upon full fee confirmation.",
        None,
    ),
    (
        "hostel_rules", "hostel",
        [
            "what items are allowed in the hostel",
            "can I bring electrical appliances to hostel",
            "hostel curfew time",
            "cooking in hostel guidelines",
        ],
        "Hostels provide 24/7 security, water, and electricity. Heavy electrical appliances (electric cookers, washing machines, hot plates) are strictly prohibited. Cooking is restricted to designated kitchenette areas. Hostel gates close by 9:00 PM daily.",
        None,
    ),
    (
        "portal_help", "portal",
        [
            "I can't log into the portal",
            "forgot my portal password",
            "how do I register courses on portal",
            "course registration error",
            "portal is not loading",
            "student portal web address",
        ],
        "Access the student portal at portal.caritasuni.edu.ng. If you cannot log in or forgot your password, click 'Reset Password' using your Matriculation/Application Number. For portal payment errors or uncredited receipts, visit the ICT/MIS Unit located near the University Library.",
        None,
    ),
    (
        "course_registration", "portal",
        [
            "how do I register my courses",
            "deadline for course registration",
            "add or drop course",
            "course form sign off by HOD",
            "what happens if I miss course registration",
        ],
        "Course registration opens during the first 3 weeks of every semester. Login to your portal, select prescribed departmental courses, submit online, print 4 copies of your Course Registration Form, and get them signed by your Course Adviser and HOD.",
        None,
    ),
    (
        "exams_results", "exams",
        [
            "when are exams starting",
            "how do I check my result",
            "exam timetable schedule",
            "result missing on portal",
            "grading system and gpa",
        ],
        "Semester examinations hold according to the official academic calendar released by Exams and Records. Results are uploaded to the student portal following Senate approval. Missing results should be formally reported through your Departmental Examination Officer.",
        None,
    ),
    (
        "exam_rules", "exams",
        [
            "what do I need to bring to the exam hall",
            "exam docket card",
            "examination malpractice policy",
            "dress code for exams",
        ],
        "To enter an examination hall, you MUST present your stamped Exam Docket, valid Student ID card, and proof of fee clearance. Strictly observe the university dress code. Mobile phones and unauthorized materials inside the hall are strictly prohibited.",
        None,
    ),
    (
        "clearance_procedure", "clearance",
        [
            "how do I do physical clearance",
            "documents needed for fresh student clearance",
            "bursary clearance steps",
            "graduating student clearance",
        ],
        "Physical clearance requires bringing original and 3 photocopies of: JAMB Admission Letter, O'Level Result, Birth Certificate/Age Declaration, Letter of Identification from L.G.A, Acceptance Fee Receipt, and 8 passport photographs to the Admissions Office.",
        None,
    ),
    (
        "transcript_request", "records",
        [
            "how to request academic transcript",
            "official transcript processing fee",
            "send transcript to foreign university",
            "statement of result collection",
        ],
        "Official academic transcripts can be ordered online via the portal or in person at the Exams & Records Directorate. Processing takes 5-7 working days. Transcripts are dispatched electronically or physically to designated institutions worldwide.",
        None,
    ),
    (
        "nysc_mobilization", "records",
        [
            "when is nysc mobilization",
            "how do I get mobilized for nysc",
            "nysc error on green card",
            "graduating list for nysc",
        ],
        "NYSC mobilization is processed automatically for all graduates who complete final clearance and Senate approval. Check your name on the Senate Approved Graduating List displayed at Student Affairs before JAMB portal registration.",
        None,
    ),
    (
        "departments_info", "departments",
        [
            "what departments do you have",
            "what courses can I study",
            "list of faculties",
            "does caritas offer law",
            "does caritas offer nursing",
            "engineering departments at caritas",
        ],
        "Caritas University offers accredited programs across 6 Faculties: Health Sciences (Nursing, Medical Lab), Natural & Applied Sciences (Computer Science, Biochemistry, Microbiology), Management & Social Sciences (Mass Comm, Accounting, Economics), Law, Engineering, and Environmental Sciences.",
        None,
    ),
    (
        "location_contact", "general",
        [
            "where is caritas university located",
            "school address",
            "how do I get to amorji nike enugu",
            "contact information",
            "phone number for student affairs",
        ],
        "Caritas University is located at Amorji-Nike, Enugu East L.G.A., Enugu State, Nigeria — about 15 minutes drive from Akanu Ibiam International Airport Enugu. Official contact: info@caritasuni.edu.ng | Student Affairs Desk: +234 (0) 803 000 1122.",
        None,
    ),
    (
        "library_services", "campus_life",
        [
            "where is the university library",
            "library opening hours",
            "how to borrow books from library",
            "e-library access login",
        ],
        "The Professor Oliver Mobisson Central Library opens Monday to Friday (8:00 AM - 7:00 PM) and Saturdays (9:00 AM - 4:00 PM). Students can register for a Library Card with 2 passports and gain full access to e-books, journals, and Wi-Fi research labs.",
        None,
    ),
    (
        "medical_center", "campus_life",
        [
            "is there a school clinic or hospital",
            "medical fitness registration",
            "what happens if a student falls sick",
            "health insurance for students",
        ],
        "The Caritas University Health Center provides 24-hour medical care, pharmacy services, and emergency ambulance transport. All 100 Level students undergo mandatory medical screening during orientation week.",
        None,
    ),
    (
        "scholarships_aid", "fees",
        [
            "are there scholarships available",
            "financial aid for students",
            "tuition rebate for best graduating students",
            "indigent student support",
        ],
        "Caritas University awards Vice-Chancellor's Academic Merit Scholarships to top performing students with a CGPA of 4.50 and above at the end of each session. Diocesan rebates and sibling discounts are also managed via Bursary.",
        None,
    ),
    (
        "thanks", "general",
        ["thank you", "thanks", "ok thank you", "alright thanks", "thanks a lot", "great help"],
        "You're very welcome! If you have any more questions about Caritas University, I'm right here to assist.",
        None,
    ),
    (
        "goodbye", "general",
        ["bye", "goodbye", "see you later", "that's all for now", "have a good day"],
        "Best wishes with your academic journey at Caritas University! Feel free to come back whenever you need information.",
        None,
    ),
]


def run():
    with app.app_context():
        db.drop_all()
        db.create_all()

        dept_objs = {}
        for name, faculty, desc in DEPARTMENTS:
            d = Department(name=name, faculty=faculty, description=desc)
            db.session.add(d)
            dept_objs[name] = d
        db.session.commit()

        for tag, category, phrases, answer, dept_name in INTENTS:
            intent = Intent(tag=tag, category=category)
            db.session.add(intent)
            db.session.flush()  # get intent.id

            for p in phrases:
                db.session.add(TrainingPhrase(intent_id=intent.id, text=p))

            faq = FAQ(
                question=phrases[0],
                answer=answer,
                intent_id=intent.id,
                department_id=dept_objs[dept_name].id if dept_name and dept_name in dept_objs else None,
            )
            db.session.add(faq)

        db.session.commit()
        refit_matcher()
        print(f"Seeded {len(DEPARTMENTS)} departments and {len(INTENTS)} intents successfully.")


if __name__ == "__main__":
    run()

