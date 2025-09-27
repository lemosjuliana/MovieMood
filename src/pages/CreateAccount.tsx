import React from "react";
import "../components/Layout/LoginPage.css";

const CreateAccount: React.FC = () => {
  return (
    <div className="login-page">
      <div className="welcome-text">
        <h1>Welcome!</h1>
        <p>Create an account to view your movie list, view history and more.</p>
      </div>
      <div className="login-container">
        <h2>Create Account</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email, e.g. example@ex.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create your password" />
          </div>

          <button type="submit" className="login-btn">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
