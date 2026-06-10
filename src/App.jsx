import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import TestSuite from "./pages/TestSuite"
import DefectTracker from "./pages/DefectTracker"
import Reports from "./pages/Reports"

export default function App() {
  const [activePage, setActivePage] = useState("dashboard")

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />
      case "tests": return <TestSuite />
      case "defects": return <DefectTracker />
      case "reports": return <Reports />
      default: return <Dashboard />
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {renderPage()}
      </main>
    </div>
  )
}