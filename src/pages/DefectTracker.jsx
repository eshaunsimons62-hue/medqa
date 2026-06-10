import { useState } from "react"
import { Bug, Plus, X } from "lucide-react"

const initialDefects = [
  { id: "DEF-001", title: "Blood pressure alert does not fire at threshold", severity: "Critical", status: "Open", category: "Alerts", description: "When systolic BP reaches exactly 140mmHg the alert fails to trigger. Only fires at 141+.", foundIn: "TC-004", assignee: "Eshaun Simons" },
  { id: "DEF-002", title: "App crashes on null SpO2 sensor value", severity: "Critical", status: "Open", category: "Error Handling", description: "When SpO2 returns null the app throws an unhandled exception and crashes instead of showing error state.", foundIn: "TC-010", assignee: "Eshaun Simons" },
  { id: "DEF-003", title: "CSV export missing temperature column", severity: "Major", status: "Fixed", category: "Data Export", description: "Exported CSV file contains HR, SpO2, and BP columns but temperature readings are not included.", foundIn: "TC-003", assignee: "Eshaun Simons" },
  { id: "DEF-004", title: "Dashboard refresh rate drops under heavy load", severity: "Minor", status: "Open", category: "Performance", description: "Under simulated load of 100+ readings per minute the UI update rate drops below the 2 second requirement.", foundIn: "TC-008", assignee: "Eshaun Simons" },
  { id: "DEF-005", title: "Threshold config resets after app restart", severity: "Major", status: "In Progress", category: "Configuration", description: "Custom threshold values saved in settings are lost when the app is fully closed and reopened.", foundIn: "TC-009", assignee: "Eshaun Simons" },
]

const severityColor = (s) => {
  if (s === "Critical") return "var(--red)"
  if (s === "Major") return "var(--yellow)"
  return "var(--text-muted)"
}

const statusColor = (s) => {
  if (s === "Open") return "var(--red)"
  if (s === "Fixed") return "var(--green)"
  if (s === "In Progress") return "var(--yellow)"
  return "var(--text-muted)"
}

const empty = { title: "", severity: "Major", status: "Open", category: "", description: "", foundIn: "", assignee: "" }

export default function DefectTracker() {
  const [defects, setDefects] = useState(initialDefects)
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)

  const nextId = () => {
    const nums = defects.map(d => parseInt(d.id.split("-")[1]))
    return "DEF-" + String(Math.max(...nums) + 1).padStart(3, "0")
  }

  const addDefect = () => {
    if (!form.title) return
    setDefects(prev => [...prev, { ...form, id: nextId() }])
    setForm(empty)
    setShowForm(false)
  }

  const updateStatus = (id, status) => {
    setDefects(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Defect Tracker</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {defects.filter(d => d.status === "Open").length} open · {defects.filter(d => d.status === "In Progress").length} in progress · {defects.filter(d => d.status === "Fixed").length} fixed
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 16px", borderRadius: "8px", border: "none",
          background: "var(--accent)", color: "white",
          fontSize: "14px", fontWeight: 600, cursor: "pointer"
        }}>
          <Plus size={15} /> Log Defect
        </button>
      </div>

      {/* New Defect Form */}
      {showForm && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--accent)",
          borderRadius: "12px", padding: "24px",
          display: "flex", flexDirection: "column", gap: "14px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 600 }}>Log New Defect</div>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Title", key: "title", full: true },
              { label: "Category", key: "category" },
              { label: "Found In (Test ID)", key: "foundIn" },
              { label: "Assignee", key: "assignee" },
            ].map(({ label, key, full }) => (
              <div key={key} style={{ gridColumn: full ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{
                    padding: "9px 12px", borderRadius: "6px",
                    border: "1px solid var(--border)", background: "var(--bg)",
                    color: "var(--text)", fontSize: "14px", outline: "none"
                  }} />
              </div>
            ))}
            {[
              { label: "Severity", key: "severity", options: ["Critical", "Major", "Minor"] },
              { label: "Status", key: "status", options: ["Open", "In Progress", "Fixed"] },
            ].map(({ label, key, options }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{
                    padding: "9px 12px", borderRadius: "6px",
                    border: "1px solid var(--border)", background: "var(--bg)",
                    color: "var(--text)", fontSize: "14px", outline: "none"
                  }}>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3} style={{
                  padding: "9px 12px", borderRadius: "6px",
                  border: "1px solid var(--border)", background: "var(--bg)",
                  color: "var(--text)", fontSize: "14px", outline: "none",
                  resize: "none", fontFamily: "inherit"
                }} />
            </div>
          </div>
          <button onClick={addDefect} style={{
            alignSelf: "flex-start", padding: "10px 20px", borderRadius: "8px",
            border: "none", background: "var(--accent)", color: "white",
            fontSize: "14px", fontWeight: 600, cursor: "pointer"
          }}>Submit Defect</button>
        </div>
      )}

      {/* Defect list + detail */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: "16px" }}>

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Title", "Severity", "Category", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "12px", fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defects.map(d => (
                <tr key={d.id} onClick={() => setSelected(selected?.id === d.id ? null : d)}
                  style={{
                    borderBottom: "1px solid var(--border)", cursor: "pointer",
                    background: selected?.id === d.id ? "var(--accent)15" : "transparent"
                  }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>{d.id}</td>
                  <td style={{ padding: "12px 16px" }}>{d.title}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: severityColor(d.severity), fontSize: "12px", fontWeight: 600 }}>{d.severity}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{d.category}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      color: statusColor(d.status), background: statusColor(d.status) + "20",
                      padding: "3px 10px", borderRadius: "20px",
                      fontSize: "12px", fontWeight: 600
                    }}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "24px",
            display: "flex", flexDirection: "column", gap: "16px",
            alignSelf: "start"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bug size={15} color="var(--red)" />
              <span style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--accent)" }}>{selected.id}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: "15px", lineHeight: 1.4 }}>{selected.title}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, background: "var(--bg)", padding: "12px", borderRadius: "8px" }}>
              {selected.description}
            </div>
            {[
              { label: "Severity", value: selected.severity },
              { label: "Category", value: selected.category },
              { label: "Found In", value: selected.foundIn },
              { label: "Assignee", value: selected.assignee },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Update Status</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Open", "In Progress", "Fixed"].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                    flex: 1, padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                    border: "1px solid var(--border)", cursor: "pointer",
                    background: selected.status === s ? statusColor(s) : "transparent",
                    color: selected.status === s ? "white" : "var(--text-muted)"
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}