import { useState } from "react"
import { FileText, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const tests = [
  { id: "TC-001", name: "Alert threshold triggers at correct HR value", category: "Alerts", priority: "High", status: "Pass" },
  { id: "TC-002", name: "SpO2 drops below 90% fires critical alert", category: "Alerts", priority: "High", status: "Pass" },
  { id: "TC-003", name: "CSV export contains all session fields", category: "Data Export", priority: "Medium", status: "Pass" },
  { id: "TC-004", name: "Blood pressure upper limit validation", category: "Alerts", priority: "High", status: "Fail" },
  { id: "TC-005", name: "Temperature out-of-range detection", category: "Alerts", priority: "Medium", status: "Pass" },
  { id: "TC-006", name: "Session data persists after app refresh", category: "Data Storage", priority: "Medium", status: "Not Run" },
  { id: "TC-007", name: "Multiple simultaneous alerts handled correctly", category: "Alerts", priority: "High", status: "Not Run" },
  { id: "TC-008", name: "Dashboard updates in real time under 2 seconds", category: "Performance", priority: "Medium", status: "Pass" },
  { id: "TC-009", name: "Threshold config saves correctly", category: "Configuration", priority: "Low", status: "Pass" },
  { id: "TC-010", name: "App handles missing sensor data gracefully", category: "Error Handling", priority: "High", status: "Fail" },
]

const defects = [
  { id: "DEF-001", title: "Blood pressure alert does not fire at threshold", severity: "Critical", status: "Open", foundIn: "TC-004" },
  { id: "DEF-002", title: "App crashes on null SpO2 sensor value", severity: "Critical", status: "Open", foundIn: "TC-010" },
  { id: "DEF-003", title: "CSV export missing temperature column", severity: "Major", status: "Fixed", foundIn: "TC-003" },
  { id: "DEF-004", title: "Dashboard refresh rate drops under heavy load", severity: "Minor", status: "Open", foundIn: "TC-008" },
  { id: "DEF-005", title: "Threshold config resets after app restart", severity: "Major", status: "In Progress", foundIn: "TC-009" },
]

const passed = tests.filter(t => t.status === "Pass").length
const failed = tests.filter(t => t.status === "Fail").length
const notRun = tests.filter(t => t.status === "Not Run").length
const total = tests.length
const passRate = Math.round((passed / total) * 100)

const statusColor = (s) => {
  if (s === "Pass" || s === "Fixed") return "#22c55e"
  if (s === "Fail" || s === "Open" || s === "Critical") return "#ef4444"
  if (s === "In Progress" || s === "Major") return "#f59e0b"
  return "#6b7280"
}

export default function Reports() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generatePDF = () => {
    setGenerating(true)
    setTimeout(() => {
      const doc = new jsPDF()
      const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

      // Header
      doc.setFillColor(26, 29, 39)
      doc.rect(0, 0, 220, 40, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("MedQA Validation Report", 14, 18)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("VitalLink Medical Monitoring Software", 14, 27)
      doc.text(`Generated: ${date}`, 14, 34)

      // Summary boxes
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Executive Summary", 14, 52)

      const boxes = [
        { label: "Total Tests", value: String(total), x: 14 },
        { label: "Passed", value: String(passed), x: 60 },
        { label: "Failed", value: String(failed), x: 106 },
        { label: "Pass Rate", value: `${passRate}%`, x: 152 },
      ]
      boxes.forEach(({ label, value, x }) => {
        doc.setFillColor(240, 242, 255)
        doc.roundedRect(x, 56, 40, 22, 3, 3, "F")
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(26, 86, 255)
        doc.text(value, x + 20, 67, { align: "center" })
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100, 100, 100)
        doc.text(label, x + 20, 73, { align: "center" })
      })

      // Compliance statement
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "normal")
      doc.text("This validation report documents the testing activities performed to verify that VitalLink Medical", 14, 90)
      doc.text("Monitoring Software meets its specified requirements in accordance with IEC 62304 software", 14, 96)
      doc.text("lifecycle standards. All test cases were executed against version 1.0.0.", 14, 102)

      // Test results table
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 30, 30)
      doc.text("Test Case Results", 14, 116)

      autoTable(doc, {
        startY: 120,
        head: [["ID", "Test Name", "Category", "Priority", "Result"]],
        body: tests.map(t => [t.id, t.name, t.category, t.priority, t.status]),
        headStyles: { fillColor: [26, 29, 39], textColor: 255, fontSize: 9, fontStyle: "bold" },
        bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [248, 249, 255] },
        columnStyles: { 0: { cellWidth: 18 }, 4: { cellWidth: 18 } },
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 4) {
            const val = data.cell.raw
            if (val === "Pass") doc.setTextColor(34, 197, 94)
            else if (val === "Fail") doc.setTextColor(239, 68, 68)
            else doc.setTextColor(107, 114, 128)
          }
        }
      })

      // Defects table
      const afterTests = doc.lastAutoTable.finalY + 12
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 30, 30)
      doc.text("Defect Log", 14, afterTests)

      autoTable(doc, {
        startY: afterTests + 4,
        head: [["ID", "Title", "Severity", "Status", "Found In"]],
        body: defects.map(d => [d.id, d.title, d.severity, d.status, d.foundIn]),
        headStyles: { fillColor: [26, 29, 39], textColor: 255, fontSize: 9, fontStyle: "bold" },
        bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [248, 249, 255] },
        columnStyles: { 0: { cellWidth: 18 }, 4: { cellWidth: 20 } },
      })

      // Sign off
      const afterDefects = doc.lastAutoTable.finalY + 16
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 30, 30)
      doc.text("Validation Sign-Off", 14, afterDefects)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(80, 80, 80)
      doc.text("Prepared by: Eshaun Simons", 14, afterDefects + 8)
      doc.text(`Date: ${date}`, 14, afterDefects + 15)
      doc.text("Software Version: 1.0.0", 14, afterDefects + 22)
      doc.text("Status: CONDITIONAL PASS — 2 critical defects require resolution before release", 14, afterDefects + 29)

      doc.save("VitalLink-Validation-Report.pdf")
      setGenerating(false)
      setGenerated(true)
      setTimeout(() => setGenerated(false), 4000)
    }, 1200)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Validation Report</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            VitalLink Medical Monitoring — v1.0.0
          </p>
        </div>
        <button onClick={generatePDF} disabled={generating} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 20px", borderRadius: "8px", border: "none",
          background: generated ? "var(--green)" : "var(--accent)",
          color: "white", fontSize: "14px", fontWeight: 600,
          cursor: generating ? "wait" : "pointer", opacity: generating ? 0.7 : 1,
          transition: "background 0.3s"
        }}>
          {generated ? <CheckCircle size={15} /> : <Download size={15} />}
          {generating ? "Generating..." : generated ? "Downloaded!" : "Export PDF Report"}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Tests", value: total, color: "var(--accent)" },
          { label: "Passed", value: passed, color: "var(--green)" },
          { label: "Failed", value: failed, color: "var(--red)" },
          { label: "Pass Rate", value: `${passRate}%`, color: passRate >= 80 ? "var(--green)" : "var(--red)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "20px"
          }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Compliance statement */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "24px",
        display: "flex", flexDirection: "column", gap: "10px"
      }}>
        <div style={{ fontWeight: 600, fontSize: "15px" }}>Compliance Statement</div>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8 }}>
          This validation report documents the testing activities performed to verify that VitalLink Medical Monitoring Software meets its specified requirements in accordance with <strong style={{ color: "var(--text)" }}>IEC 62304 software lifecycle standards</strong>. All test cases were executed against version 1.0.0.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", borderRadius: "8px",
          background: "#f59e0b20", border: "1px solid #f59e0b40",
          fontSize: "13px", fontWeight: 600, color: "var(--yellow)",
          alignSelf: "flex-start"
        }}>
          ⚠ CONDITIONAL PASS — 2 critical defects require resolution before release
        </div>
      </div>

      {/* Test results */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>
          Test Case Results
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["ID", "Test Name", "Category", "Priority", "Result"].map(h => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: "11px", fontWeight: 600,
                  color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>{t.id}</td>
                <td style={{ padding: "11px 16px", fontSize: "13px" }}>{t.name}</td>
                <td style={{ padding: "11px 16px", fontSize: "13px", color: "var(--text-muted)" }}>{t.category}</td>
                <td style={{ padding: "11px 16px", fontSize: "12px", fontWeight: 600, color: t.priority === "High" ? "var(--red)" : t.priority === "Medium" ? "var(--yellow)" : "var(--text-muted)" }}>{t.priority}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    fontSize: "12px", fontWeight: 600,
                    color: statusColor(t.status),
                    background: statusColor(t.status) + "20",
                    padding: "3px 10px", borderRadius: "20px"
                  }}>
                    {t.status === "Pass" ? <CheckCircle size={11} /> : t.status === "Fail" ? <XCircle size={11} /> : <Clock size={11} />}
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sign off */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "24px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"
      }}>
        <div style={{ fontWeight: 600, fontSize: "15px", gridColumn: "1 / -1" }}>Validation Sign-Off</div>
        {[
          { label: "Prepared By", value: "Eshaun Simons" },
          { label: "Date", value: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
          { label: "Software Version", value: "1.0.0" },
          { label: "Document Status", value: "Draft" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "14px", fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>

    </div>
  )
}