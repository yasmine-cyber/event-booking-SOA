import React, { useState, useContext } from "react";
import { login } from "../api/apiContext";
import { AuthContext } from "../context/AuthContext";
import Toast from "./Toast";
import "../styles/Auth.css";

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const { setUser } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
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

    if (!formData.email || !formData.motDePasse) {
      setToast({ type: "error", message: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData);
      const user = response.data;
      
      // Store user and token
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      setToast({ type: "success", message: "Login successful!" });
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (err) {
      setToast({ type: "error", message: "Invalid email or password" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back 👋</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button className="link-btn" onClick={onSwitchToRegister}>
              Create one here
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

export default Login;
