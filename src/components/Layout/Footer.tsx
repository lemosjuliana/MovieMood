import React from "react";
import "./Footer.css";
import logo2 from "../../assets/logo2.png";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <img src={logo2} alt="Logo" className="footer-logo" />
          <ul className="footer-links">
            <li>
              <NavLink to="/about">Contact Us</NavLink>
            </li>
            <li>
              <NavLink to="/about">FAQ</NavLink>
            </li>
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-right">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook className="social-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter className="social-icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram className="social-icon" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MovieMood. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
