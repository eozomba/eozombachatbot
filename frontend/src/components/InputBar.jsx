import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="input-bar">
      <textarea
        rows={1}
        placeholder="Ask about admissions, fees, hostel…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        className="send-btn"
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <SendHorizontal size={18} strokeWidth={2.25} />
      </button>

      <style>{`
        .input-bar {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid var(--line);
          background: var(--paper);
          flex-shrink: 0;
        }
        textarea {
          flex: 1;
          resize: none;
          max-height: 100px;
          border: 1px solid var(--line-strong);
          border-radius: var(--r-md);
          padding: 10px 12px;
          font-size: 14.5px;
          font-family: var(--font-body);
          color: var(--ink);
          background: var(--surface);
          line-height: 1.4;
        }
        textarea:focus {
          outline: none;
          border-color: var(--red);
          background: var(--paper);
        }
        textarea::placeholder {
          color: var(--muted);
        }
        .send-btn {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border: none;
          background: var(--red);
          color: #fff;
          border-radius: var(--r-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .send-btn:disabled {
          background: var(--line-strong);
          color: var(--muted);
          cursor: not-allowed;
        }
        .send-btn:not(:disabled):hover {
          background: var(--red-700);
        }
        .send-btn:not(:disabled):active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  )
}
