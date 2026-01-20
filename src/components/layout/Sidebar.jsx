import { useState } from "react";
import { FaHome, FaStickyNote, FaCalendar, FaUser, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", label: "Home", icon: FaHome, path: "/dashboard" },
    { id: "notes", label: "Notes", icon: FaStickyNote, path: "/notes" },
    { id: "calendar", label: "Calendar", icon: FaCalendar, path: "/calendar" },
    { id: "profile", label: "Profile", icon: FaUser, path: "/profile" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">✓</span>
          <span className="logo-text">Tasks</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`menu-item ${active === item.id ? "active" : ""}`}
              onClick={() => {
                setActive(item.id);
                if (item.path !== "#") navigate(item.path);
              }}
            >
              <Icon className="menu-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="help-section">
          <FaChevronDown className="help-icon" />
          <p>Need help or any questions?</p>
          <button className="help-btn">Go to Help Page</button>
        </div>
      </div>
    </div>
  );
}
