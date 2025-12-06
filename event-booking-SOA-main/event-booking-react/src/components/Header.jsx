import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header.css";

function Header({ onAuthClick }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo">🗓️ EventHub</h1>
          <p className="tagline">Manage Your Events Like Never Before</p>
        </div>
        <div className="header-right">
          {user ? (
            <div className="user-section">
              <div className="user-info">
                <span className="user-name">{user.nom}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-section">
              <button 
                onClick={() => onAuthClick('login')} 
                className="btn btn-primary"
                style={{ marginRight: '0.5rem' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => onAuthClick('register')} 
                className="btn btn-secondary"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
