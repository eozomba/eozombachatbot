# Caritas University Enquiry Chatbot

An AI-powered university enquiry assistant for **Caritas University, Amorji-Nike, Enugu, Nigeria**.

Built with React (Vite) on the frontend and Flask + scikit-learn + Groq (Llama 3.1) on the backend.

---

## Features

- **Smart Q&A Engine** — two-tier matching: TF-IDF cosine similarity + Groq LLM fallback
- **Smart Entity Resolver** — instant precise answers for department cut-offs, fees, O'Level requirements
- **Dynamic Follow-up Suggestions** — context-aware suggestion chips after every bot reply
- **Multi-Section Navigation** — Assistant, Knowledge Hub, Departments Directory, Quick Tools tabs
- **Interactive Tools** — Fee & Accommodation Estimator, Admission Eligibility Checker, Clearance Checklist
- **Hero Sliding Carousel** — landing page with autoplaying campus image slideshow
- **Ambient Background Slideshow** — on desktop, a subtle blurred campus backdrop behind the app shell
- **Expandable FAQ Knowledge Base** — categorised, searchable FAQs covering 22+ intents

---

## Project Structure

```
caritas-chatbot/
├── backend/
│   ├── app.py               # Flask API + smart answer resolver
│   ├── ml_engine.py         # TF-IDF / cosine similarity matcher
│   ├── groq_service.py      # Groq LLM Tier-2 fallback
│   ├── models.py            # SQLAlchemy models
│   ├── seed_data.py         # DB seeder (run once to populate KB)
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx          # Root app + BackgroundSlideshow
    │   ├── pages/           # LandingPage, AuthPage, KnowledgeHub, DepartmentsDirectory, QuickTools
    │   └── components/      # Header, NavTabs, ChatWindow, MessageBubble, InputBar, QuickReplies
    ├── public/              # Static assets (crest.png, hero images)
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hackversetechnologies-code/eozombachatbot.git
cd eozombachatbot
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Seed the Database

```bash
python seed_data.py
```

### 4. Run the Backend

```bash
python app.py
# Runs at http://localhost:5000
```

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `GROQ_MODEL` | Model name (default: `llama-3.1-8b-instant`) |
| `FLASK_SECRET_KEY` | Strong random secret key for Flask sessions |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/session` | Create a new chat session |
| `POST` | `/api/chat` | Send a message, get reply + suggestions |
| `GET` | `/api/faqs` | List FAQs (supports `?category=` and `?search=`) |
| `GET` | `/api/departments` | List all faculties and departments |
| `GET` | `/api/quick-topics` | Get initial suggested question chips |
| `POST` | `/api/tools/estimate-fees` | Estimate session fees |
| `GET` | `/api/health` | Health check |

---

## License

Built as an academic project by Caritas University students.
