import React, { useState, useContext } from "react";
import { registerParticipant, registerOrganizer } from "../api/apiContext";
import { AuthContext } from "../context/AuthContext";
import Toast from "./Toast";
import "../styles/Auth.css";

function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const { setUser } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("participant");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nom ||
      !formData.email ||
      !formData.motDePasse ||
      !formData.confirmPassword
    ) {
      setToast({ type: "error", message: "Please fill in all fields" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setToast({ type: "error", message: "Please enter a valid email address" });
      return;
    }

    if (formData.motDePasse.length < 6) {
      setToast({ type: "error", message: "Password must be at least 6 characters" });
      return;
    }

    if (formData.motDePasse !== formData.confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        nom: formData.nom,
        email: formData.email,
        motDePasse: formData.motDePasse,
      };

      let response;
      if (userType === "participant") {
        response = await registerParticipant(userData);
      } else {
        response = await registerOrganizer(userData);
      }

      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      setToast({
        type: "success",
        message: `Registration successful! Welcome ${formData.nom}!`,
      });

      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Registration failed",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join EventHub 🚀</h2>
          <p>Create your account</p>
        </div>

        <div className="user-type-selector">
          <button
            type="button"
            className={`type-btn ${userType === "participant" ? "active" : ""}`}
            onClick={() => setUserType("participant")}
          >
            👤 Participant
          </button>
          <button
            type="button"
            className={`type-btn ${userType === "organisateur" ? "active" : ""}`}
            onClick={() => setUserType("organisateur")}
          >
            🎭 Organizer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nom">Full Name</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="motDePasse">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="motDePasse"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            <span className="password-hint">Must be at least 6 characters</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button className="link-btn" onClick={onSwitchToLogin}>
              Sign in here
            </button>
          </p>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Register;
