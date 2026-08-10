import { useState, useEffect } from 'react'
import { Building2, GraduationCap, ArrowRight, BookOpenCheck } from 'lucide-react'
import { getDepartments } from '../api'

export default function DepartmentsDirectory({ onAskAssistant }) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDepartments()
      .then((data) => {
        setDepartments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="departments-dir">
      <div className="dept-header">
        <h2>Faculties & Academic Departments</h2>
        <p>Explore accredited undergraduate degree programs offered at Caritas University.</p>
      </div>

      <div className="dept-content">
        {loading ? (
          <div className="dept-loading">Loading academic departments...</div>
        ) : (
          <div className="dept-grid">
            {departments.map((d) => (
              <div className="dept-card" key={d.id}>
                <div className="dept-card-header">
                  <div className="dept-icon-box">
                    <GraduationCap size={20} color="var(--red)" />
                  </div>
                  <div>
                    <h3>{d.name}</h3>
                    <span className="dept-faculty-tag">{d.faculty}</span>
                  </div>
                </div>

                <p className="dept-desc">{d.description || 'Full-time undergraduate program.'}</p>

                <button
                  className="btn-dept-enquire"
                  onClick={() =>
                    onAskAssistant(`What are the entry requirements and cut-off for ${d.name}?`)
                  }
                >
                  <span>Check Admission Cut-off</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .departments-dir {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background: var(--paper);
        }
        .dept-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--line);
          background: var(--surface);
        }
        .dept-header h2 {
          font-family: var(--font-display);
          font-size: 18px;
          margin: 0 0 4px;
          color: var(--ink);
        }
        .dept-header p {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0;
        }
        .dept-content {
          padding: 16px 20px;
          flex: 1;
        }
        .dept-loading {
          text-align: center;
          padding: 40px;
          color: var(--ink-soft);
        }
        .dept-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .dept-card {
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 14px;
          background: var(--paper);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .dept-card-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
        }
        .dept-icon-box {
          background: var(--red-100);
          padding: 8px;
          border-radius: var(--r-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dept-card h3 {
          font-family: var(--font-display);
          font-size: 15px;
          margin: 0 0 3px;
          color: var(--ink);
        }
        .dept-faculty-tag {
          font-size: 11.5px;
          color: var(--red-700);
          font-weight: 500;
        }
        .dept-desc {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0 0 14px;
          line-height: 1.45;
        }
        .btn-dept-enquire {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          padding: 8px 12px;
          border-radius: var(--r-sm);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .btn-dept-enquire:hover {
          background: var(--red-100);
          border-color: var(--red-200);
          color: var(--red-700);
        }
      `}</style>
    </div>
  )
}
