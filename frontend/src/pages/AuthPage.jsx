import { useState } from 'react'
import { X, ArrowLeft, Loader2 } from 'lucide-react'

const NOTICES = {
  login: 'Login to access the enquiry assistant.',
  signup: null,
}

export default function AuthPage({ mode: initialMode, onBack, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode)
  const [matric, setMatric] = useState('')
  const [access, setAccess] = useState('')
  const [confirmAccess, setConfirmAccess] = useState('')
  const [showNotice, setShowNotice] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState('')

  const isSignup = mode === 'signup'

  const submit = (e) => {
    e.preventDefault()
    setFieldError('')

    if (!matric.trim() || !access.trim()) {
      setFieldError('Please fill in both fields.')
      return
    }
    if (isSignup && access !== confirmAccess) {
      setFieldError('Access codes do not match.')
      return
    }

    // Dummy auth: any matric number + access code combination works.
    // This is a demo credential flow, not real authentication.
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onAuthSuccess({ matric: matric.trim() })
    }, 700)
  }

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2.25} /> Back
        </button>
        <div className="landing-brand">
          <img src="/crest.png" alt="Caritas University crest" />
          <div>
            <div className="brand-name">Caritas University</div>
            <div className="brand-loc">Amorji-Nike, Enugu</div>
          </div>
        </div>
        <span style={{ width: 60 }} />
      </header>

      <div className="auth-grid">
        <div className="auth-card">
          <h1>{isSignup ? 'CREATE YOUR ACCOUNT' : 'LOGIN TO YOUR ACCOUNT'}</h1>

          {!isSignup && NOTICES.login && showNotice && (
            <div className="notice">
              <span>{NOTICES.login}</span>
              <button aria-label="Dismiss" onClick={() => setShowNotice(false)}>
                <X size={15} />
              </button>
            </div>
          )}

          <form onSubmit={submit}>
            <label>
              Matriculation Number<span className="req">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Matric/Application No"
              value={matric}
              onChange={(e) => setMatric(e.target.value)}
              autoComplete="username"
            />

            {isSignup && (
              <>
                <label>
                  Surname<span className="req">*</span>
                </label>
                <input type="text" placeholder="Your surname" />
              </>
            )}

            <label>
              {isSignup ? 'Create Access Code' : 'Access Code'}
              <span className="req">*</span>
            </label>
            <input
              type="password"
              placeholder={isSignup ? 'Create an access code' : 'Your access code Or Surname (new enrolees only)'}
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />

            {isSignup && (
              <>
                <label>
                  Confirm Access Code<span className="req">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your access code"
                  value={confirmAccess}
                  onChange={(e) => setConfirmAccess(e.target.value)}
                  autoComplete="new-password"
                />
              </>
            )}

            {fieldError && <p className="field-error">{fieldError}</p>}

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" /> {isSignup ? 'Creating account…' : 'Logging in…'}
                </>
              ) : (
                isSignup ? 'SIGN UP' : 'LOGIN'
              )}
            </button>
          </form>

          {!isSignup ? (
            <>
              <a className="link" href="#" onClick={(e) => e.preventDefault()}>
                Retrieve Access Code
              </a>
              <p className="fine-print">
                ***Note that your login details are case-sensitive, you must therefore use
                capital and lower letters correctly when logging in.
              </p>
              <p className="switch-mode">
                New student?{' '}
                <button type="button" onClick={() => setMode('signup')}>
                  Create an account
                </button>
              </p>
            </>
          ) : (
            <p className="switch-mode">
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>
                Login instead
              </button>
            </p>
          )}
        </div>

        <div className="info-card">
          <h2>WELCOME TO THE CARITAS UNIVERSITY ENQUIRY ASSISTANT</h2>
          <p className="info-lede">
            Sign in with any matric or application number to try it — this is a demo
            account, not a real portal login.
          </p>
          <ul className="info-list">
            <li>Ask about admissions, fees, hostel, exams and the portal, any time.</li>
            <li>Your chat is kept for this session so you can pick up where you left off.</li>
            <li>Quick topic chips get you a straight answer without typing it out.</li>
          </ul>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--surface);
        }
        .auth-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: var(--paper);
          border-bottom: 1px solid var(--line);
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: none;
          color: var(--ink-soft);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          width: 60px;
        }
        .back-btn:hover { color: var(--red); }
        .landing-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .landing-brand img { width: 30px; height: 30px; object-fit: contain; }
        .brand-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13.5px;
          color: var(--ink);
          line-height: 1.15;
        }
        .brand-loc { font-size: 11px; color: var(--muted); }

        .auth-grid {
          max-width: 920px;
          margin: 0 auto;
          padding: 36px 20px 60px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 760px) {
          .auth-grid { grid-template-columns: 1fr; padding: 20px 16px 40px; }
        }

        .auth-card, .info-card {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--r-md);
          padding: 24px;
        }
        .auth-card h1 {
          font-family: var(--font-display);
          font-size: 19px;
          letter-spacing: 0.01em;
          margin: 0 0 18px;
          color: var(--ink);
        }
        .notice {
          background: var(--red-100);
          border: 1px solid var(--red-200);
          color: var(--red-700);
          border-radius: var(--r-sm);
          padding: 12px 14px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          font-size: 13.5px;
          margin-bottom: 20px;
        }
        .notice button {
          background: none;
          border: none;
          color: var(--red-700);
          opacity: 0.6;
          cursor: pointer;
          flex-shrink: 0;
        }
        .notice button:hover { opacity: 1; }

        label {
          display: block;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 12.5px;
          letter-spacing: 0.02em;
          color: var(--ink);
          margin: 16px 0 7px;
        }
        label:first-of-type { margin-top: 0; }
        .req { color: var(--red); margin-left: 2px; }
        input[type="text"], input[type="password"] {
          width: 100%;
          box-sizing: border-box;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: var(--r-sm);
          padding: 12px 13px;
          font-size: 14px;
          color: var(--ink);
        }
        input:focus {
          outline: none;
          border-color: var(--red);
          background: var(--paper);
        }
        .field-error {
          color: var(--red-700);
          font-size: 12.5px;
          margin: 10px 0 0;
        }
        .submit-btn {
          width: 100%;
          margin-top: 22px;
          background: var(--red);
          color: #fff;
          border: none;
          border-radius: var(--r-sm);
          padding: 13px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.03em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: var(--red-700); }
        .submit-btn:disabled { opacity: 0.75; cursor: default; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .link {
          display: inline-block;
          margin-top: 16px;
          color: var(--red);
          font-size: 13px;
          font-style: italic;
          text-decoration: none;
        }
        .link:hover { text-decoration: underline; }
        .fine-print {
          font-size: 11.5px;
          color: var(--muted);
          line-height: 1.5;
          margin-top: 14px;
        }
        .switch-mode {
          font-size: 13px;
          color: var(--ink-soft);
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .switch-mode button {
          background: none;
          border: none;
          color: var(--red);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }
        .switch-mode button:hover { text-decoration: underline; }

        .info-card h2 {
          font-family: var(--font-display);
          font-size: 15px;
          letter-spacing: 0.01em;
          margin: 0 0 10px;
          color: var(--ink);
        }
        .info-lede {
          font-size: 13px;
          color: var(--ink-soft);
          line-height: 1.5;
          margin: 0 0 16px;
        }
        .info-list {
          margin: 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info-list li {
          font-size: 13px;
          color: var(--ink-soft);
          line-height: 1.45;
        }
      `}</style>
    </div>
  )
}
