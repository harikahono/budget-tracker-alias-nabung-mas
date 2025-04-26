"use client"

import { useState } from "react"
import { Menu, Bell, User, Search } from "lucide-react"

const Header = ({ toggleSidebar }) => {
  const [notifications] = useState(3)

  return (
    <header className="header">
      <button className="btn btn-outline" onClick={toggleSidebar}>
        <Menu size={20} />
      </button>

      <div className="logo-container" style={{ marginLeft: "20px" }}>
        <h1 style={{ color: "var(--primary)", fontWeight: 700 }}>Nabung Mas</h1>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "20px" }}>
        <div className="search-container" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            className="form-input"
            style={{
              padding: "8px 16px 8px 40px",
              width: "250px",
              borderRadius: "20px",
            }}
          />
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-secondary)",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button className="btn btn-outline rounded-full" style={{ width: "40px", height: "40px", padding: 0 }}>
            <Bell size={20} />
          </button>
          {notifications > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "var(--accent)",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {notifications}
            </span>
          )}
        </div>

        <div className="user-profile" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            className="avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
