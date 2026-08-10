export default function TypingIndicator() {
  return (
    <div className="bubble-row bot">
      <div className="typing-bubble" aria-label="Assistant is typing">
        <span className="cross">
          <i /><i /><i /><i />
        </span>
      </div>

      <style>{`
        .typing-bubble {
          background: var(--paper);
          border: 1px solid var(--line);
          border-bottom-left-radius: 2px;
          border-radius: var(--r-md);
          padding: 12px 14px;
          display: inline-flex;
        }
        .cross {
          position: relative;
          width: 21px;
          height: 21px;
          display: grid;
          grid-template-columns: 6px 6px 6px;
          grid-template-rows: 6px 6px 6px;
          gap: 1.5px;
        }
        .cross i {
          background: var(--red);
          display: block;
          animation: crest-pulse 1.1s ease-in-out infinite;
        }
        /* plus-sign layout: top, left, right, bottom — center left empty */
        .cross i:nth-child(1) { grid-column: 2; grid-row: 1; animation-delay: 0s; }
        .cross i:nth-child(2) { grid-column: 1; grid-row: 2; animation-delay: 0.15s; }
        .cross i:nth-child(3) { grid-column: 3; grid-row: 2; animation-delay: 0.3s; }
        .cross i:nth-child(4) { grid-column: 2; grid-row: 3; animation-delay: 0.45s; }
        @keyframes crest-pulse {
          0%, 60%, 100% { opacity: 0.25; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
