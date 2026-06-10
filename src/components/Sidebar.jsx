import { LayoutDashboard, FlaskConical, Bug, FileText } from "lucide-react"

const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tests", label: "Test Suite", icon: FlaskConical },
  { id: "defects", label: "Defect Tracker", icon: Bug },
  { id: "reports", label: "Reports", icon: FileText },
]

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside style={{
      width: "220px", background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      padding: "24px 16px", display: "flex",
      flexDirection: "column", gap: "4px",
      minHeight: "100vh", flexShrink: 0
    }}>
      <div style={{
        fontWeight: 700, fontSize: "18px",
        color: "var(--accent)", marginBottom: "32px",
        paddingLeft: "12px"
      }}>
        MedQA
      </div>
      {links.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => setActivePage(id)} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "8px", border: "none",
          background: activePage === id ? "var(--accent)" : "transparent",
          color: activePage === id ? "white" : "var(--text-muted)",
          cursor: "pointer", fontSize: "14px", fontWeight: 500,
          textAlign: "left", width: "100%", transition: "all 0.15s"
        }}>
          <Icon size={16} />
          {label}
        </button>
      ))}
    </aside>
  )
}