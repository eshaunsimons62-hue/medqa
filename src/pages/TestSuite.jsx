import { useState } from "react"
import { CheckCircle, XCircle, Clock, Play } from "lucide-react"

const initialTests = [
  { id: "TC-001", name: "Alert threshold triggers at correct HR value", category: "Alerts", priority: "High", status: "Pass", steps: "Set HR threshold to 100. Simulate HR of 105. Verify alert fires." },
  { id: "TC-002", name: "SpO2 drops below 90% fires critical alert", category: "Alerts", priority: "High", status: "Pass", steps: "Set SpO2 threshold to 90. Simulate SpO2 of 88. Verify critical alert." },
  { id: "TC-003", name: "CSV export contains all session fields", category: "Data Export", priority: "Medium", status: "Pass", steps: "Run a 30s session. Click export. Verify CSV contains HR, SpO2, BP, Temp, Timestamp." },
  { id: "TC-004", name: "Blood pressure upper limit validation", category: "Alerts", priority: "High", status: "Fail", steps: "Set BP threshold to 140. Simulate systolic of 145. Verify alert fires." },
  { id: "TC-005", name: "Temperature out-of-range detection", category: "Alerts", priority: "Medium", status: "Pass", steps: "Set temp threshold to 101. Simulate temp of 102.5. Verify alert fires." },
  { id: "TC-006", name: "Session data persists after app refresh", category: "Data Storage", priority: "Medium", status: "Not Run", steps: "Start session, record 10 readings. Refresh app. Verify data still present." },
  { id: "TC-007", name: "Multiple simultaneous alerts handled correctly", category: "Alerts", priority: "High", status: "Not Run", steps: "Simulate HR and SpO2 both out of range simultaneously. Verify both alerts fire." },
  { id: "TC-008", name: "Dashboard updates in real time under 2 seconds", category: "Performance", priority: "Medium", status: "Pass", steps: "Start simulation. Measure time between data emit and UI update. Must be under 2000ms." },
  { id: "TC-009", name: "Threshold config saves correctly", category: "Configuration", priority: "Low", status: "Pass", steps: "Open settings. Change HR threshold to 110. Restart app. Verify threshold is still 110." },
  { id: "TC-010", name: "App handles missing sensor data gracefully", category: "Error Handling", priority: "High", status: "Fail", steps: "Simulate null SpO2 value. Verify app shows error state instead of crashing." },
]

const statusIcon = (s) => {
  if (s === "Pass") return <CheckCircle size={15} color="var(--green)" />
  if (s === "Fail") return <XCircle size={15} color="var(--red)" />
  return <Clock size={15} color="var(--text-muted)" />
}

const statusColor = (s) => {
  if (s === "Pass") return "var(--green)"
  if (s === "Fail") return "var(--red)"
  return "var(--text-muted)"
}

const priorityColor = (p) => {
  if (p === "High") return "var(--red)"
  if (p === "Medium") return "var(--yellow)"
  return "var(--text-muted)"
}

export default function TestSuite() {
  const [tests, setTests] = useState(initialTests)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState("All")

  const categories = ["All", ...new Set(initialTests.map(t => t.category))]

  const filtered = filter === "All" ? tests : tests.filter(t => t.category === filter)

  const runTest = (id) => {
    setTests(prev => prev.map(t => {
      if (t.id !== id) return t
      const result = Math.random() > 0.25 ? "Pass" : "Fail"
      return { ...t, status: result }
    }))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Test Suite</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {tests.filter(t => t.status === "Pass").length} passed · {tests.filter(t => t.status === "Fail").length} failed · {tests.filter(t => t.status === "Not Run").length} not run
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 14px", borderRadius: "20px", border: "1px solid var(--border)",
            background: filter === c ? "var(--accent)" : "transparent",
            color: filter === c ? "white" : "var(--text-muted)",
            fontSize: "13px", cursor: "pointer", fontWeight: 500
          }}>{c}</button>
        ))}
      </div>

      {/* Table + Detail panel */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: "16px" }}>

        {/* Table */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Test Name", "Category", "Priority", "Status", "Run"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "12px", fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}
                  onClick={() => setSelected(selected?.id === t.id ? null : t)}
                  style={{
                    borderBottom: "1px solid var(--border)", cursor: "pointer",
                    background: selected?.id === t.id ? "var(--accent)15" : "transparent",
                    transition: "background 0.15s"
                  }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>{t.id}</td>
                  <td style={{ padding: "12px 16px" }}>{t.name}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{t.category}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: priorityColor(t.priority), fontSize: "12px", fontWeight: 600 }}>{t.priority}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      color: statusColor(t.status), fontSize: "12px", fontWeight: 600
                    }}>
                      {statusIcon(t.status)} {t.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={(e) => { e.stopPropagation(); runTest(t.id) }} style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      padding: "5px 10px", borderRadius: "6px",
                      border: "1px solid var(--border)", background: "transparent",
                      color: "var(--text-muted)", fontSize: "12px", cursor: "pointer"
                    }}>
                      <Play size={11} /> Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "24px",
            display: "flex", flexDirection: "column", gap: "16px",
            alignSelf: "start"
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--accent)" }}>{selected.id}</div>
            <div style={{ fontWeight: 600, fontSize: "15px", lineHeight: 1.4 }}>{selected.name}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Category", value: selected.category },
                { label: "Priority", value: selected.priority },
                { label: "Status", value: selected.status },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-muted)" }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Test Steps</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, background: "var(--bg)", padding: "12px", borderRadius: "8px" }}>{selected.steps}</div>
            </div>
            <button onClick={() => runTest(selected.id)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "10px", borderRadius: "8px", border: "none",
              background: "var(--accent)", color: "white",
              fontSize: "14px", fontWeight: 600, cursor: "pointer"
            }}>
              <Play size={14} /> Run Test
            </button>
          </div>
        )}
      </div>
    </div>
  )
}