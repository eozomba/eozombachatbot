export default function QuickReplies({ topics, onSelect }) {
  if (!topics?.length) return null
  return (
    <div className="quick-replies">
      {topics.map((t) => (
        <button key={t.label} className="chip" onClick={() => onSelect(t.message)}>
          {t.label}
        </button>
      ))}

      <style>{`
        .quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 4px 2px 8px;
        }
        .chip {
          border: 1px solid var(--line-strong);
          background: var(--paper);
          color: var(--ink);
          font-size: 13px;
          font-family: var(--font-body);
          font-weight: 500;
          padding: 7px 12px;
          border-radius: var(--r-sm);
          cursor: pointer;
        }
        .chip:hover {
          border-color: var(--red);
          color: var(--red-700);
          background: var(--red-100);
        }
        .chip:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  )
}
