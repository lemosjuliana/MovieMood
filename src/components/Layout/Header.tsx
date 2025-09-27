import React from "react";
import "./Header.css";
import logo from "../../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <NavLink to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </NavLink>
      </div>
      <nav className="header-right">
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/find-movies">Find Movies</NavLink>
          </li>
          <li>
            <NavLink to="/my-list">My List</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <FaUserCircle className="profile-icon" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
