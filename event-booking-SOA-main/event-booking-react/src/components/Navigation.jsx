import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navigation.css";

function Navigation({ currentPage, onNavigate }) {
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let menuItems = [
    { id: "events", label: "Browse Events", icon: "📅" },
  ];

  if (user) {
    menuItems.push({ id: "my-reservations", label: "My Reservations", icon: "🎟️" });
    if (user.userType === "organisateur") {
      menuItems.push({ id: "create-event", label: "Create Event", icon: "➕" });
      menuItems.push({ id: "manage-events", label: "Manage Events", icon: "⚙️" });
    }
  } else {
    menuItems.push({ id: "auth", label: "Sign In / Register", icon: "🔐" });
  }

  const handleNavigate = (itemId) => {
    if (itemId === "auth") {
      onNavigate("auth");
    } else {
      onNavigate(itemId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
        <ul className={`nav-menu ${mobileMenuOpen ? "open" : ""}`}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentPage === item.id ? "active" : ""}`}
                onClick={() => handleNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
