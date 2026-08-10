import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import QuickReplies from './QuickReplies.jsx'
import { HelpCircle } from 'lucide-react'

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function ChatWindow({ messages, isTyping, topics, onQuickSelect, showQuickReplies }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  // Get latest bot message suggestions if any
  const lastBotMessage = [...messages].reverse().find((m) => m.sender === 'bot')
  const activeSuggestions = lastBotMessage?.suggestions?.length
    ? lastBotMessage.suggestions
    : [
        'What are the admission requirements?',
        'What is the JAMB cut-off mark?',
        'How much is school fees?',
        'Is hostel accommodation available?',
      ]

  return (
    <div className="chat-window">
      <div className="intro">
        <p className="intro-line">
          <strong>Love for Education and Morals.</strong>
        </p>
        <p className="intro-sub">Ask me anything about Caritas University, Amorji-Nike.</p>
      </div>

      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          sender={m.sender}
          text={m.text}
          time={m.created_at ? formatTime(m.created_at) : null}
          suggestions={m.suggestions}
          onSelectSuggestion={onQuickSelect}
        />
      ))}

      {isTyping && <TypingIndicator />}

      {/* Dynamic Suggested Follow-ups bar */}
      {messages.length > 0 && !isTyping && (
        <div className="active-suggestions-bar">
          <div className="sug-bar-title">
            <HelpCircle size={13} color="var(--red-700)" />
            <span>Suggested follow-ups (tap to ask):</span>
          </div>
          <div className="sug-chips">
            {activeSuggestions.map((s, idx) => (
              <button key={idx} className="sug-chip-btn" onClick={() => onQuickSelect(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {showQuickReplies && <QuickReplies topics={topics} onSelect={onQuickSelect} />}

      <div ref={bottomRef} />

      <style>{`
        .chat-window {
          flex: 1;
          overflow-y: auto;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          background: var(--surface);
        }
        .intro {
          text-align: center;
          padding: 10px 12px 16px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 14px;
        }
        .intro-line {
          font-family: var(--font-display);
          font-size: 13.5px;
          color: var(--red-700);
          margin: 0 0 4px;
          letter-spacing: 0.01em;
        }
        .intro-sub {
          font-size: 12.5px;
          color: var(--muted);
          margin: 0;
        }
        .active-suggestions-bar {
          margin-top: 12px;
          padding: 10px;
          background: var(--paper);
          border: 1px solid var(--red-200);
          border-radius: var(--r-sm);
        }
        .sug-bar-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--red-700);
          margin-bottom: 8px;
        }
        .sug-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .sug-chip-btn {
          background: var(--surface);
          border: 1px solid var(--line-strong);
          color: var(--ink);
          font-size: 12px;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: var(--r-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .sug-chip-btn:hover {
          background: var(--red-100);
          border-color: var(--red);
          color: var(--red-700);
        }
      `}</style>
    </div>
  )
}

