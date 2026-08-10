import { useState, useEffect } from 'react'
import {
  MessageCircleQuestion,
  GraduationCap,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Clock,
  Send,
  HelpCircle,
  BookOpen,
} from 'lucide-react'

const CAROUSEL_SLIDES = [
  {
    image: '/hero_campus.png',
    title: 'Caritas University, Amorji-Nike Enugu',
    subtitle: 'A serene academic environment dedicated to character and moral excellence.',
  },
  {
    image: '/hero_library.png',
    title: 'State-of-the-Art Library & e-Learning',
    subtitle: 'Empowering students with extensive research journals, e-books, and high-speed Wi-Fi.',
  },
  {
    image: '/hero_graduation.png',
    title: 'Accredited Degrees & Future Leaders',
    subtitle: 'NUC fully accredited programs across Health Sciences, Law, Engineering, and Natural Sciences.',
  },
]

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Admissions & Cut-off Marks',
    text: 'Check JAMB cut-off requirements, O\'Level credits, and Direct Entry guidelines instantly.',
  },
  {
    icon: FileText,
    title: 'School Fees & Installments',
    text: 'View exact tuition breakdown per level, acceptance fees, and Bursary installment schedules.',
  },
  {
    icon: Building2,
    title: 'Hostel Accommodation',
    text: 'Find out about on-campus hostel allocation, fees, room amenities, and hostel rules.',
  },
]

const STATS = [
  { label: 'Accredited Faculties', value: '6 Faculties', icon: Building2 },
  { label: 'Degree Programs', value: '40+ Courses', icon: GraduationCap },
  { label: 'Enquiry Desk Availability', value: '24/7 Instant AI', icon: Clock },
  { label: 'Information Verification', value: '100% NUC Aligned', icon: ShieldCheck },
]

export default function LandingPage({ onLogin, onSignup }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [demoQuery, setDemoQuery] = useState('')
  const [demoResponse, setDemoResponse] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
  }

  const handleDemoSend = (e) => {
    e.preventDefault()
    if (!demoQuery.trim()) return
    const q = demoQuery.toLowerCase()
    let ans =
      "Caritas University offers 5 O'Level credit admission requirements, JAMB general cut-off 140 (Law/Nursing 180), on-campus hostels, and portal services. Sign up or log in for complete AI answers!"
    if (q.includes('fee') || q.includes('tuition')) {
      ans =
        "School fees range from N350,000 to N650,000 per session depending on faculty and level, payable in 2 flexible installments upon Bursary approval."
    } else if (q.includes('hostel') || q.includes('room')) {
      ans =
        'On-campus hostel rooms are allocated upon full acceptance fee payment. Rates range from N80,000 to N120,000 per session.'
    }
    setDemoResponse(ans)
  }

  return (
    <div className="landing">
      {/* Top Header Navigation */}
      <header className="landing-nav">
        <div className="landing-brand">
          <img src="/crest.png" alt="Caritas University Crest" />
          <div>
            <div className="brand-name">Caritas University</div>
            <div className="brand-loc">Amorji-Nike, Enugu</div>
          </div>
        </div>
        <div className="nav-actions">
          <button className="btn-text" onClick={onLogin}>
            Login
          </button>
          <button className="btn-primary" onClick={onSignup}>
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section with Image Carousel */}
      <section className="hero-section">
        <div className="hero-carousel">
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <div
              key={slide.title}
              className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
            >
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-overlay">
                <span className="eyebrow">Caritas Enquiry Assistant</span>
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}

          <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous Slide">
            <ChevronLeft size={20} />
          </button>
          <button className="carousel-btn next" onClick={nextSlide} aria-label="Next Slide">
            <ChevronRight size={20} />
          </button>

          <div className="carousel-dots">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Copy & Call To Action */}
        <div className="hero-content">
          <h1>Ask anything about Caritas University. Get instant answers.</h1>
          <p className="lede">
            No need to stand in long queues at Student Affairs or Bursary. Check admissions, fees, cut-off marks, hostel allocation, and portal troubleshooting 24/7.
          </p>

          <div className="hero-actions">
            <button className="btn-primary btn-lg" onClick={onSignup}>
              Create Student Account
            </button>
            <button className="btn-outline btn-lg" onClick={onLogin}>
              Access Student Portal
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Quick Demo Section */}
      <section className="demo-section">
        <div className="demo-card">
          <div className="demo-header">
            <MessageCircleQuestion size={20} color="var(--red)" />
            <span>Try a quick question right now</span>
          </div>
          <form onSubmit={handleDemoSend} className="demo-form">
            <input
              type="text"
              placeholder="e.g. What is the cut-off mark for Nursing Science?"
              value={demoQuery}
              onChange={(e) => setDemoQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              <Send size={15} /> Ask
            </button>
          </form>
          {demoResponse && (
            <div className="demo-reply-box">
              <strong>Caritas Assistant Response:</strong>
              <p>{demoResponse}</p>
            </div>
          )}
        </div>
      </section>

      {/* Key University Stats */}
      <section className="landing-stats">
        {STATS.map((s) => {
          const Icon = s.icon
          return (
            <div className="stat-card" key={s.label}>
              <Icon size={22} color="var(--red)" />
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          )
        })}
      </section>

      {/* Key Feature Cards */}
      <section className="landing-features">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon-box">
                <Icon size={22} color="var(--red)" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          )
        })}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>
          <strong>Caritas University</strong> — Amorji-Nike, P.M.B. 01784 Enugu, Nigeria.
        </div>
        <div className="footer-note">
          <ShieldCheck size={14} /> Official Automated Student Enquiry Desk
        </div>
      </footer>

      <style>{`
        .landing {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--paper);
          display: flex;
          flex-direction: column;
        }
        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid var(--line);
          max-width: 1080px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .landing-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .landing-brand img {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }
        .brand-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 15px;
          color: var(--ink);
          line-height: 1.15;
        }
        .brand-loc {
          font-size: 11.5px;
          color: var(--muted);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-text {
          background: none;
          border: none;
          color: var(--ink);
          font-weight: 600;
          font-size: 13.5px;
          padding: 8px 12px;
          cursor: pointer;
        }
        .btn-text:hover { color: var(--red); }
        .btn-primary {
          background: var(--red);
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 13.5px;
          padding: 9px 18px;
          border-radius: var(--r-sm);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-primary:hover { background: var(--red-700); }
        .btn-outline {
          background: var(--paper);
          color: var(--ink);
          border: 1px solid var(--line-strong);
          font-weight: 600;
          font-size: 13.5px;
          padding: 9px 18px;
          border-radius: var(--r-sm);
          cursor: pointer;
        }
        .btn-outline:hover { border-color: var(--ink); }
        .btn-lg { padding: 12px 22px; font-size: 14.5px; }

        .hero-section {
          max-width: 1080px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 20px 32px;
          box-sizing: border-box;
        }
        .hero-carousel {
          position: relative;
          width: 100%;
          height: 320px;
          border-radius: var(--r-md);
          overflow: hidden;
          border: 1px solid var(--line-strong);
          margin-bottom: 28px;
        }
        @media (max-width: 600px) {
          .hero-carousel { height: 240px; }
        }
        .carousel-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }
        .carousel-slide.active {
          opacity: 1;
        }
        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: #fff;
        }
        .eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--red);
          color: #fff;
          padding: 4px 8px;
          border-radius: var(--r-sm);
          margin-bottom: 8px;
        }
        .slide-overlay h2 {
          font-family: var(--font-display);
          font-size: 20px;
          margin: 0 0 4px;
          color: #fff;
        }
        .slide-overlay p {
          font-size: 13px;
          margin: 0;
          color: rgba(255,255,255,0.9);
        }
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          color: #fff;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
        }
        .carousel-btn:hover { background: var(--red); }
        .carousel-btn.prev { left: 12px; }
        .carousel-btn.next { right: 12px; }
        .carousel-dots {
          position: absolute;
          bottom: 12px;
          right: 16px;
          display: flex;
          gap: 6px;
          z-index: 5;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid #fff;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 0;
        }
        .dot.active {
          background: var(--red);
          border-color: var(--red);
          width: 22px;
          border-radius: 5px;
        }

        .hero-content {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .hero-content h1 {
          font-family: var(--font-display);
          font-size: clamp(26px, 4.5vw, 36px);
          line-height: 1.2;
          color: var(--ink);
          margin: 0 0 14px;
        }
        .lede {
          font-size: 15px;
          line-height: 1.55;
          color: var(--ink-soft);
          margin: 0 0 24px;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .demo-section {
          max-width: 720px;
          width: 100%;
          margin: 0 auto 32px;
          padding: 0 20px;
          box-sizing: border-box;
        }
        .demo-card {
          border: 1px solid var(--line-strong);
          border-radius: var(--r-md);
          padding: 16px;
          background: var(--surface);
        }
        .demo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 13.5px;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .demo-form {
          display: flex;
          gap: 8px;
        }
        .demo-form input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid var(--line-strong);
          border-radius: var(--r-sm);
          font-size: 13px;
          outline: none;
          background: var(--paper);
        }
        .demo-reply-box {
          margin-top: 12px;
          padding: 12px;
          background: var(--paper);
          border: 1px solid var(--red-200);
          border-radius: var(--r-sm);
          font-size: 13px;
        }
        .demo-reply-box strong {
          color: var(--red-700);
          display: block;
          margin-bottom: 4px;
        }
        .demo-reply-box p {
          margin: 0;
          color: var(--ink-soft);
        }

        .landing-stats {
          max-width: 1080px;
          width: 100%;
          margin: 0 auto 32px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .landing-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .stat-card {
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 16px;
          background: var(--surface);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .stat-value {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 16px;
          color: var(--ink);
          margin: 8px 0 2px;
        }
        .stat-label {
          font-size: 12px;
          color: var(--ink-soft);
        }

        .landing-features {
          max-width: 1080px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px 48px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .landing-features { grid-template-columns: 1fr; }
        }
        .feature-card {
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 20px;
          background: var(--paper);
        }
        .feature-icon-box {
          background: var(--red-100);
          width: 40px;
          height: 40px;
          border-radius: var(--r-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .feature-card h3 {
          font-family: var(--font-display);
          font-size: 15px;
          margin: 0 0 6px;
          color: var(--ink);
        }
        .feature-card p {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0;
          line-height: 1.5;
        }

        .landing-footer {
          margin-top: auto;
          border-top: 1px solid var(--line);
          padding: 18px 24px;
          max-width: 1080px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
          color: var(--muted);
        }
        .footer-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </div>
  )
}
