import React from "react";
import { Link } from "react-router-dom";
import "../components/Layout/LoginPage.css";

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <div className="welcome-text">
        <h1>Welcome back</h1>
        <p>Log in to view your movie list, view history and more.</p>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Create one.</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
