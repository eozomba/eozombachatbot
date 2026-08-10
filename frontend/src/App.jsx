import { useEffect, useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import NavTabs from './components/NavTabs.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import InputBar from './components/InputBar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import KnowledgeHub from './pages/KnowledgeHub.jsx'
import DepartmentsDirectory from './pages/DepartmentsDirectory.jsx'
import QuickTools from './pages/QuickTools.jsx'
import { createSession, sendMessage, getQuickTopics } from './api.js'

let idCounter = 1
const nextId = () => idCounter++

const BG_IMAGES = ['/hero_campus.png', '/hero_library.png', '/hero_graduation.png']

function BackgroundSlideshow() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % BG_IMAGES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-slideshow-container">
      {BG_IMAGES.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt=""
          className={`bg-slide-img ${idx === activeIdx ? 'active' : ''}`}
        />
      ))}
      <div className="bg-overlay-glass" />
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'auth' | 'app'
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'knowledge' | 'departments' | 'tools'
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)

  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [topics, setTopics] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (view !== 'app') return
    if (!sessionId) {
      createSession()
        .then((data) => setSessionId(data.session_id))
        .catch(() => setError('Could not reach the server. Is the Flask backend running?'))
    }

    getQuickTopics()
      .then(setTopics)
      .catch(() => {})
  }, [view, sessionId])

  const pushMessage = useCallback((sender, text, suggestions = []) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), sender, text, suggestions, created_at: new Date().toISOString() },
    ])
  }, [])

  const handleSend = useCallback(
    async (text) => {
      pushMessage('user', text)
      setIsTyping(true)
      setError(null)
      try {
        const res = await sendMessage(text, sessionId)
        if (!sessionId) setSessionId(res.session_id)
        pushMessage('bot', res.reply, res.suggestions || [])
      } catch (e) {
        pushMessage(
          'bot',
          "I couldn't reach the server just now. Please check your connection and try again."
        )
      } finally {
        setIsTyping(false)
      }
    },
    [sessionId, pushMessage]
  )

  const handleAskAssistant = useCallback(
    (question) => {
      setActiveTab('chat')
      handleSend(question)
    },
    [handleSend]
  )

  const handleAuthSuccess = (authedUser) => {
    setUser(authedUser)
    setMessages([])
    setSessionId(null)
    setView('app')
    setActiveTab('chat')
  }

  const handleLogout = () => {
    setUser(null)
    setSessionId(null)
    setMessages([])
    setView('landing')
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onLogin={() => {
          setAuthMode('login')
          setView('auth')
        }}
        onSignup={() => {
          setAuthMode('signup')
          setView('auth')
        }}
      />
    )
  }

  if (view === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onBack={() => setView('landing')}
        onAuthSuccess={handleAuthSuccess}
      />
    )
  }

  return (
    <>
      <BackgroundSlideshow />
      <div className="app-shell">
        <Header user={user} onLogout={handleLogout} />
        <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'chat' && (
          <>
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              topics={topics}
              onQuickSelect={handleSend}
              showQuickReplies={messages.length === 0}
            />
            {error && <div className="banner-error">{error}</div>}
            <InputBar onSend={handleSend} disabled={isTyping} />
          </>
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeHub onAskAssistant={handleAskAssistant} />
        )}

        {activeTab === 'departments' && (
          <DepartmentsDirectory onAskAssistant={handleAskAssistant} />
        )}

        {activeTab === 'tools' && (
          <QuickTools onAskAssistant={handleAskAssistant} />
        )}

        <style>{`
          .banner-error {
            background: #FBE4D8;
            color: var(--red-700);
            font-size: 12.5px;
            padding: 8px 12px;
            border-top: 1px solid var(--line);
            text-align: center;
          }
        `}</style>
      </div>
    </>
  )
}


