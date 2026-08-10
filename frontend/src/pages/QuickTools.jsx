import { useState } from 'react'
import { Calculator, CheckSquare, Sparkles, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { estimateFees } from '../api'

export default function QuickTools({ onAskAssistant }) {
  const [toolTab, setToolTab] = useState('fees')

  // Fee estimator state
  const [faculty, setFaculty] = useState('Natural and Applied Sciences')
  const [level, setLevel] = useState(100)
  const [includeHostel, setIncludeHostel] = useState(true)
  const [feeResult, setFeeResult] = useState(null)
  const [calcLoading, setCalcLoading] = useState(false)

  // Eligibility state
  const [jambScore, setJambScore] = useState(180)
  const [olevelCredits, setOlevelCredits] = useState(5)
  const [chosenCourse, setChosenCourse] = useState('Computer Science')

  const handleCalculateFee = async (e) => {
    e.preventDefault()
    setCalcLoading(true)
    try {
      const res = await estimateFees({ faculty, level, include_hostel: includeHostel })
      setFeeResult(res)
    } catch (err) {
      // fallback calculation offline
      const base = faculty.includes('Health') || faculty.includes('Law') ? 520000 : 380000
      const acc = level === 100 ? 50000 : 0
      const hostel = includeHostel ? 90000 : 0
      const tot = base + acc + hostel + 25000
      setFeeResult({
        total_estimated: tot,
        base_tuition: base,
        acceptance_fee: acc,
        hostel_fee: hostel,
        ict_dev_fee: 25000,
        installment_plan: {
          first_semester: Math.round(tot * 0.6),
          second_semester: tot - Math.round(tot * 0.6),
        },
      })
    } finally {
      setCalcLoading(false)
    }
  }

  const checkEligibility = () => {
    let cutoff = 140
    if (chosenCourse.includes('Law') || chosenCourse.includes('Nursing')) cutoff = 180
    if (chosenCourse.includes('Engineering')) cutoff = 160

    const isJambEligible = jambScore >= cutoff
    const isOlevelEligible = olevelCredits >= 5

    return {
      eligible: isJambEligible && isOlevelEligible,
      cutoff,
      isJambEligible,
      isOlevelEligible,
    }
  }

  const eligibility = checkEligibility()

  return (
    <div className="quick-tools">
      <div className="tools-header">
        <h2>Interactive Campus Tools</h2>
        <p>Estimate tuition fees, verify admission eligibility, and track clearance requirements.</p>

        <div className="tools-sub-tabs">
          <button
            className={`tool-tab-btn ${toolTab === 'fees' ? 'active' : ''}`}
            onClick={() => setToolTab('fees')}
          >
            <Calculator size={14} /> Fee Estimator
          </button>
          <button
            className={`tool-tab-btn ${toolTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setToolTab('eligibility')}
          >
            <Sparkles size={14} /> Eligibility Checker
          </button>
          <button
            className={`tool-tab-btn ${toolTab === 'clearance' ? 'active' : ''}`}
            onClick={() => setToolTab('clearance')}
          >
            <CheckSquare size={14} /> Clearance Checklist
          </button>
        </div>
      </div>

      <div className="tools-body">
        {toolTab === 'fees' && (
          <div className="tool-card">
            <h3>Tuition & Accomodation Cost Calculator</h3>
            <p className="tool-intro">Calculate estimated expenses per session including tuition, hostel, and installment breakdown.</p>

            <form onSubmit={handleCalculateFee} className="tool-form">
              <div className="form-group">
                <label>Faculty</label>
                <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
                  <option value="Natural and Applied Sciences">Faculty of Natural & Applied Sciences</option>
                  <option value="Management and Social Sciences">Faculty of Management & Social Sciences</option>
                  <option value="Faculty of Law">Faculty of Law</option>
                  <option value="Faculty of Health Sciences">Faculty of Health Sciences (Nursing, MedLab)</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label>Academic Level</label>
                <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
                  <option value={100}>100 Level (Freshman)</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level / Finalist</option>
                </select>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="hostel-chk"
                  checked={includeHostel}
                  onChange={(e) => setIncludeHostel(e.target.checked)}
                />
                <label htmlFor="hostel-chk">Include On-Campus Hostel Accomodation</label>
              </div>

              <button type="submit" className="btn-calc" disabled={calcLoading}>
                {calcLoading ? 'Calculating...' : 'Calculate Fee Breakdown'}
              </button>
            </form>

            {feeResult && (
              <div className="fee-result-box">
                <h4>Estimated Fee Summary</h4>
                <div className="fee-row">
                  <span>Base Tuition Fee</span>
                  <span>₦{feeResult.base_tuition.toLocaleString()}</span>
                </div>
                {feeResult.acceptance_fee > 0 && (
                  <div className="fee-row">
                    <span>Acceptance Fee</span>
                    <span>₦{feeResult.acceptance_fee.toLocaleString()}</span>
                  </div>
                )}
                {feeResult.hostel_fee > 0 && (
                  <div className="fee-row">
                    <span>Hostel Accomodation</span>
                    <span>₦{feeResult.hostel_fee.toLocaleString()}</span>
                  </div>
                )}
                <div className="fee-row">
                  <span>ICT & Portal Development</span>
                  <span>₦{feeResult.ict_dev_fee.toLocaleString()}</span>
                </div>

                <div className="fee-row total-row">
                  <span>Total Estimated Session Fee</span>
                  <span>₦{feeResult.total_estimated.toLocaleString()}</span>
                </div>

                {feeResult.installment_plan && (
                  <div className="installment-box">
                    <div className="inst-title">Permitted Installment Payment Plan:</div>
                    <div>1st Semester (60%): <strong>₦{feeResult.installment_plan.first_semester.toLocaleString()}</strong></div>
                    <div>2nd Semester (40%): <strong>₦{feeResult.installment_plan.second_semester.toLocaleString()}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {toolTab === 'eligibility' && (
          <div className="tool-card">
            <h3>Post-UTME Admission Eligibility Checker</h3>
            <p className="tool-intro">Check if your JAMB UTME score and O'Level credits meet the entry cut-off requirements.</p>

            <div className="tool-form">
              <div className="form-group">
                <label>Target Course / Department</label>
                <select value={chosenCourse} onChange={(e) => setChosenCourse(e.target.value)}>
                  <option value="Computer Science">Computer Science (Cutoff 140)</option>
                  <option value="Nursing Science">Nursing Science (Cutoff 180)</option>
                  <option value="Law">Law (Cutoff 180)</option>
                  <option value="Mass Communication">Mass Communication (Cutoff 140)</option>
                  <option value="Accounting">Accounting (Cutoff 140)</option>
                  <option value="Electrical Engineering">Electrical Engineering (Cutoff 160)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your JAMB Score ({jambScore})</label>
                <input
                  type="range"
                  min="100"
                  max="350"
                  value={jambScore}
                  onChange={(e) => setJambScore(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>O'Level Credit Passes ({olevelCredits} Subjects)</label>
                <select value={olevelCredits} onChange={(e) => setOlevelCredits(Number(e.target.value))}>
                  <option value={3}>3 Credits</option>
                  <option value={4}>4 Credits</option>
                  <option value={5}>5 Credits (Standard)</option>
                  <option value={6}>6+ Credits</option>
                </select>
              </div>

              <div className={`eligibility-badge ${eligibility.eligible ? 'success' : 'warn'}`}>
                {eligibility.eligible ? (
                  <>
                    <CheckCircle size={20} />
                    <div>
                      <strong>Eligible for Admission!</strong>
                      <p>Your JAMB score ({jambScore}) meets the departmental cut-off ({eligibility.cutoff}) with required O'Level credits.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    <div>
                      <strong>Requires Attention</strong>
                      <p>
                        {!eligibility.isJambEligible
                          ? `JAMB score ${jambScore} is below departmental cut-off (${eligibility.cutoff}).`
                          : "Minimum 5 O'Level credits including English and Math are required."}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                className="btn-enquire-elig"
                onClick={() =>
                  onAskAssistant(
                    `What are the full entry requirements for ${chosenCourse} with JAMB score ${jambScore}?`
                  )
                }
              >
                <span>Ask Assistant about ${chosenCourse}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {toolTab === 'clearance' && (
          <div className="tool-card">
            <h3>Freshman Physical Clearance Checklist</h3>
            <p className="tool-intro">Items needed for physical screening at the Admissions Office.</p>

            <ul className="clearance-list">
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>Original & 3 photocopies of JAMB Admission Letter</span>
              </li>
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>WAEC / NECO / NABTEB Statement of Result</span>
              </li>
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>Birth Certificate or Sworn Declaration of Age</span>
              </li>
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>Local Government Identification Letter</span>
              </li>
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>Official Caritas Acceptance Fee Receipt (N50,000)</span>
              </li>
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>8 Recent Passport Photographs (Red Background)</span>
              </li>
              <li>
                <CheckCircle size={16} color="var(--green)" />
                <span>Attestation Letter from Sponsor / Guardian</span>
              </li>
            </ul>

            <button
              className="btn-enquire-elig"
              onClick={() => onAskAssistant('Where is the physical clearance screening venue located?')}
            >
              <span>Ask Assistant about Clearance Office</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .quick-tools {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background: var(--paper);
        }
        .tools-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--line);
          background: var(--surface);
        }
        .tools-header h2 {
          font-family: var(--font-display);
          font-size: 18px;
          margin: 0 0 4px;
          color: var(--ink);
        }
        .tools-header p {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0 0 12px;
        }
        .tools-sub-tabs {
          display: flex;
          gap: 6px;
        }
        .tool-tab-btn {
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
        }
        .tool-tab-btn.active {
          background: var(--red);
          color: #fff;
          border-color: var(--red-700);
        }
        .tools-body {
          padding: 16px 20px;
          flex: 1;
        }
        .tool-card h3 {
          font-family: var(--font-display);
          font-size: 16px;
          margin: 0 0 4px;
          color: var(--ink);
        }
        .tool-intro {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0 0 16px;
        }
        .tool-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink);
        }
        .form-group select, .form-group input[type="range"] {
          padding: 8px 10px;
          border: 1px solid var(--line-strong);
          border-radius: var(--r-sm);
          font-size: 13px;
          background: var(--paper);
        }
        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--ink);
        }
        .btn-calc {
          background: var(--red);
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: var(--r-sm);
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }
        .fee-result-box {
          margin-top: 16px;
          padding: 14px;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: var(--r-sm);
        }
        .fee-result-box h4 {
          margin: 0 0 10px;
          font-family: var(--font-display);
          color: var(--ink);
        }
        .fee-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 4px 0;
          color: var(--ink-soft);
        }
        .total-row {
          border-top: 1px solid var(--line-strong);
          margin-top: 8px;
          padding-top: 8px;
          font-weight: 700;
          color: var(--red-700);
          font-size: 14px;
        }
        .installment-box {
          margin-top: 10px;
          background: var(--red-100);
          padding: 10px;
          border-radius: var(--r-sm);
          font-size: 12px;
          color: var(--red-700);
        }
        .inst-title {
          font-weight: 700;
          margin-bottom: 4px;
        }
        .eligibility-badge {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 12px;
          border-radius: var(--r-sm);
          font-size: 13px;
        }
        .eligibility-badge.success {
          background: var(--green-100);
          color: var(--green);
          border: 1px solid var(--green);
        }
        .eligibility-badge.warn {
          background: var(--red-100);
          color: var(--red-700);
          border: 1px solid var(--red-200);
        }
        .eligibility-badge p {
          margin: 4px 0 0;
          font-size: 12px;
        }
        .btn-enquire-elig {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          padding: 10px 12px;
          border-radius: var(--r-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .clearance-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .clearance-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--ink);
          background: var(--surface);
          padding: 10px 12px;
          border-radius: var(--r-sm);
          border: 1px solid var(--line);
        }
      `}</style>
    </div>
  )
}
