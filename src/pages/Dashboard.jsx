import { FlaskConical, Bug, CheckCircle, XCircle } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"

const tests = [
  { id: "TC-001", name: "Alert threshold triggers at correct HR value", category: "Alerts", status: "Pass" },
  { id: "TC-002", name: "SpO2 drops below 90% fires critical alert", category: "Alerts", status: "Pass" },
  { id: "TC-003", name: "CSV export contains all session fields", category: "Data Export", status: "Pass" },
  { id: "TC-004", name: "Blood pressure upper limit validation", category: "Alerts", status: "Fail" },
  { id: "TC-005", name: "Temperature out-of-range detection", category: "Alerts", status: "Pass" },
  { id: "TC-006", name: "Session data persists after app refresh", category: "Data Storage", status: "Not Run" },
  { id: "TC-007", name: "Multiple simultaneous alerts handled correctly", category: "Alerts", status: "Not Run" },
  { id: "TC-008", name: "Dashboard updates in real time under 2 seconds", category: "Performance", status: "Pass" },
  { id: "TC-009", name: "Threshold config saves correctly", category: "Configuration", status: "Pass" },
  { id: "TC-010", name: "App handles missing sensor data gracefully", category: "Error Handling", status: "Fail" },
]

const defects = [
  { severity: "Critical", status: "Open" },
  { severity: "Critical", status: "Open" },
  { severity: "Major", status: "Fixed" },
  { severity: "Minor", status: "Open" },
  { severity: "Major", status: "In Progress" },
]

const passed = tests.filter(t => t.status === "Pass").length
const failed = tests.filter(t => t.status === "Fail").length
const notRun = tests.filter(t => t.status === "Not Run").length
const openDefects = defects.filter(d => d.status === "Open").length
const passRate = Math.round((passed / tests.length) * 100)

const pieData = [
  { name: "Passed", value: passed },
  { name: "Failed", value: failed },
  { name: "Not Run", value: notRun },
]
const PIE_COLORS = ["#22c55e", "#ef4444", "#6b7280"]

const categories = [...new Set(tests.map(t => t.category))]
const barData = categories.map(cat => ({
  name: cat,
  Pass: tests.filter(t => t.category === cat && t.status === "Pass").length,
  Fail: tests.filter(t => t.category === cat && t.status === "Fail").length,
}))

const recentTests = tests.slice(0, 5)
const statusColor = (s) => s === "Pass" ? "var(--green)" : s === "Fail" ? "var(--red)" : "var(--text-muted)"

export default function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>QA Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          VitalLink Medical Monitoring — Validation Overview
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Tests", value: tests.length, icon: FlaskConical, color: "var(--accent)" },
          { label: "Passed", value: passed, icon: CheckCircle, color: "var(--green)" },
          { label: "Failed", value: failed, icon: XCircle, color: "var(--red)" },
          { label: "Open Defects", value: openDefects, icon: Bug, color: "var(--yellow)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: color + "20", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pass Rate Banner */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "20px 24px",
        display: "flex", alignItems: "center", gap: "20px"
      }}>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
          Overall Pass Rate
        </div>
        <div style={{ flex: 1, background: "var(--border)", borderRadius: "99px", height: "8px" }}>
          <div style={{
            width: `${passRate}%`, height: "100%", borderRadius: "99px",
            background: passRate >= 80 ? "var(--green)" : "var(--red)",
            transition: "width 0.6s ease"
          }} />
        </div>
        <div style={{
          fontSize: "20px", fontWeight: 700,
          color: passRate >= 80 ? "var(--green)" : "var(--red)"
        }}>{passRate}%</div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>

        {/* Pie chart */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "24px"
        }}>
          <div style={{ fontWeight: 600, marginBottom: "16px" }}>Test Results</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50}
                outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: PIE_COLORS[i] }} />
                <span style={{ color: "var(--text-muted)" }}>{d.name}</span>
                <span style={{ marginLeft: "auto", fontWeight: 600 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "24px"
        }}>
          <div style={{ fontWeight: 600, marginBottom: "16px" }}>Results by Category</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={14}>
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              <Bar dataKey="Pass" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Fail" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent tests */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>
          Recent Test Runs
        </div>
        {recentTests.map((t, i) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 24px",
            borderBottom: i < recentTests.length - 1 ? "1px solid var(--border)" : "none"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>{t.id}</span>
              <span style={{ fontSize: "14px" }}>{t.name}</span>
            </div>
            <span style={{
              fontSize: "12px", fontWeight: 600, color: statusColor(t.status),
              background: statusColor(t.status) + "20",
              padding: "3px 10px", borderRadius: "20px"
            }}>{t.status}</span>
          </div>
        ))}
      </div>

    </div>
  )
}