import React, { useState, useEffect } from "react";
import { getFact } from "../api/apiContext";
import "../styles/Footer.css";

function Footer() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFact();
  }, []);

  const loadFact = () => {
    getFact()
      .then((res) => setFact(res.data.fact))
      .catch((err) => console.error("Error loading fact:", err))
      .finally(() => setLoading(false));
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About EventHub</h3>
            <p>Your premier platform for discovering, creating, and managing events.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#browse">Browse Events</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Fun Fact 💡</h3>
            <p className={`fact ${loading ? "loading" : ""}`}>
              {loading ? "Loading..." : fact || "Did you know? Events bring people together!"}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
