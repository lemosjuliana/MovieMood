import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../components/Layout/LoginPage.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Save email to localStorage so Watchlist knows who is logged in
        localStorage.setItem("mm_email", data.user.email);

        setMessage("✅ Logged in!");
        setEmail("");
        setPassword("");

        // ✅ Optional: Redirect to the watchlist page after login
        window.location.href = "/watchlist";
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="welcome-text">
        <h1>Welcome back</h1>
        <p>Log in to view your movie list, view history and more.</p>
      </div>

      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && <p className="feedback">{message}</p>}

        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Create one.</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
