import { useState, useEffect } from 'react'
import {
  Search,
  BookOpen,
  GraduationCap,
  Coins,
  Home,
  FileSpreadsheet,
  Laptop,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { getFaqs } from '../api'

const CATEGORIES = [
  { id: 'all', label: 'All FAQs', icon: BookOpen },
  { id: 'admissions', label: 'Admissions', icon: GraduationCap },
  { id: 'fees', label: 'Fees & Payment', icon: Coins },
  { id: 'hostel', label: 'Hostels', icon: Home },
  { id: 'exams', label: 'Exams & Results', icon: FileSpreadsheet },
  { id: 'portal', label: 'Portal Help', icon: Laptop },
  { id: 'clearance', label: 'Clearance', icon: CheckCircle2 },
]

export default function KnowledgeHub({ onAskAssistant }) {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    getFaqs(category, search)
      .then((data) => {
        setFaqs(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [category, search])

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="knowledge-hub">
      <div className="kh-header">
        <h2>Knowledge Base & FAQ Search</h2>
        <p>Explore official Caritas University guidelines, requirements, and answers.</p>

        <div className="kh-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search FAQs, cut-off marks, portal issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="kh-categories">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSel = category === cat.id
            return (
              <button
                key={cat.id}
                className={`category-chip ${isSel ? 'selected' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                <Icon size={14} strokeWidth={isSel ? 2.2 : 1.8} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="kh-content">
        {loading ? (
          <div className="kh-loading">Loading Knowledge Base articles...</div>
        ) : faqs.length === 0 ? (
          <div className="kh-empty">
            <BookOpen size={32} strokeWidth={1.5} color="var(--muted)" />
            <p>No matching FAQs found. Try searching with different keywords.</p>
          </div>
        ) : (
          <div className="faq-list">
            {faqs.map((faq) => {
              const isOpen = expandedId === faq.id
              return (
                <div className={`faq-card ${isOpen ? 'open' : ''}`} key={faq.id}>
                  <button className="faq-question-head" onClick={() => toggleExpand(faq.id)}>
                    <span className="faq-question-text">{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.answer}</p>
                      <div className="faq-card-footer">
                        <button
                          className="btn-ask-bot"
                          onClick={() => onAskAssistant(faq.question)}
                        >
                          <MessageSquare size={14} /> Ask Assistant about this
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .knowledge-hub {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background: var(--paper);
        }
        .kh-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--line);
          background: var(--surface);
        }
        .kh-header h2 {
          font-family: var(--font-display);
          font-size: 18px;
          margin: 0 0 4px;
          color: var(--ink);
        }
        .kh-header p {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0 0 14px;
        }
        .kh-search-bar {
          position: relative;
          margin-bottom: 12px;
        }
        .kh-search-bar .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }
        .kh-search-bar input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border: 1px solid var(--line-strong);
          border-radius: var(--r-sm);
          font-size: 13.5px;
          outline: none;
          background: var(--paper);
          color: var(--ink);
        }
        .kh-search-bar input:focus {
          border-color: var(--red);
        }
        .kh-categories {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .kh-categories::-webkit-scrollbar { display: none; }
        .category-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--r-sm);
          border: 1px solid var(--line);
          background: var(--paper);
          color: var(--ink-soft);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }
        .category-chip:hover {
          border-color: var(--line-strong);
          color: var(--ink);
        }
        .category-chip.selected {
          background: var(--red);
          color: #fff;
          border-color: var(--red-700);
        }
        .kh-content {
          padding: 16px 20px;
          flex: 1;
        }
        .kh-loading, .kh-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--ink-soft);
          font-size: 13.5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faq-card {
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          background: var(--paper);
          overflow: hidden;
          transition: border-color 0.15s ease;
        }
        .faq-card.open {
          border-color: var(--red-200);
          box-shadow: var(--shadow-flat);
        }
        .faq-question-head {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: transparent;
          border: none;
          text-align: left;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14px;
          color: var(--ink);
          cursor: pointer;
          gap: 10px;
        }
        .faq-question-head:hover {
          color: var(--red);
        }
        .faq-answer-body {
          padding: 0 14px 14px;
          border-top: 1px solid var(--line);
          background: var(--surface);
        }
        .faq-answer-body p {
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--ink-soft);
          margin: 12px 0 14px;
        }
        .faq-card-footer {
          display: flex;
          justify-content: flex-end;
        }
        .btn-ask-bot {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--red-100);
          color: var(--red-700);
          border: 1px solid var(--red-200);
          padding: 6px 12px;
          border-radius: var(--r-sm);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-ask-bot:hover {
          background: var(--red);
          color: #fff;
        }
      `}</style>
    </div>
  )
}
