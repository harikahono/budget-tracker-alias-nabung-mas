import { NavLink } from "react-router-dom"
import { Home, List, PieChart, Target, BarChart3, Settings, LogOut } from "lucide-react"

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: "/", name: "Dashboard", icon: <Home size={20} /> },
    { path: "/transactions", name: "Transactions", icon: <List size={20} /> },
    // Removed the duplicate Add Transaction menu item
    { path: "/budget", name: "Budget", icon: <PieChart size={20} /> },
    { path: "/goals", name: "Savings Goals", icon: <Target size={20} /> },
    { path: "/reports", name: "Reports", icon: <BarChart3 size={20} /> },
    { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
  ]

  return (
    <div className={`sidebar ${!isOpen ? "closed" : ""}`}>
      <div
        className="sidebar-header"
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--primary)",
            textAlign: "center",
          }}
        >
          Nabung Mas
        </h1>
      </div>

      <div className="sidebar-content" style={{ padding: "20px 0" }}>
        <ul style={{ listStyle: "none" }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  sidebar-link
                  ${isActive ? "active" : ""}
                `}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  color: isActive ? "var(--primary)" : "var(--text-primary)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  borderLeft: isActive ? "4px solid var(--primary)" : "4px solid transparent",
                  backgroundColor: isActive ? "rgba(0, 191, 166, 0.1)" : "transparent",
                })}
              >
                <span style={{ marginRight: "12px" }}>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="sidebar-footer"
        style={{
          padding: "20px",
          borderTop: "1px solid var(--border)",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <button className="btn btn-outline w-full">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
