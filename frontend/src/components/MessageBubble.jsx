import { HelpCircle } from 'lucide-react'

export default function MessageBubble({ sender, text, time, suggestions, onSelectSuggestion }) {
  const isUser = sender === 'user'
  return (
    <div className={`bubble-row ${isUser ? 'user' : 'bot'}`}>
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
        <p className="bubble-text">{text}</p>
      </div>

      {!isUser && suggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          <div className="suggestions-head">
            <HelpCircle size={13} color="var(--red-700)" />
            <span>Suggested follow-ups:</span>
          </div>
          <div className="suggestions-chips">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => onSelectSuggestion?.(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {time && <span className="bubble-time">{time}</span>}

      <style>{`
        .bubble-row {
          display: flex;
          flex-direction: column;
          max-width: 86%;
          margin-bottom: 6px;
        }
        .bubble-row.user {
          align-self: flex-end;
          align-items: flex-end;
        }
        .bubble-row.bot {
          align-self: flex-start;
          align-items: flex-start;
        }
        .bubble {
          padding: 9px 12px;
          font-size: 14px;
          line-height: 1.45;
          border-radius: var(--r-md);
        }
        .bubble-user {
          background: var(--red);
          color: #fff;
          border-bottom-right-radius: 2px;
        }
        .bubble-bot {
          background: var(--paper);
          color: var(--ink);
          border: 1px solid var(--line);
          border-bottom-left-radius: 2px;
        }
        .bubble-text {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .bubble-time {
          font-size: 10.5px;
          color: var(--muted);
          margin-top: 3px;
          padding: 0 2px;
        }
        .suggestions-container {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .suggestions-head {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--red-700);
        }
        .suggestions-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .suggestion-chip {
          background: var(--paper);
          border: 1px solid var(--red-200);
          color: var(--red-700);
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: var(--r-sm);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .suggestion-chip:hover {
          background: var(--red-100);
          border-color: var(--red);
        }
      `}</style>
    </div>
  )
}

