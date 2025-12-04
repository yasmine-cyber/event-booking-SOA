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
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
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
