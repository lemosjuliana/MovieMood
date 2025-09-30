import React from "react";
import heroImg from "../assets/hero.png";
import featA from "../assets/logo.png";
import featB from "../assets/logo2.png";
import featC from "../assets/react.svg";
import "../components/Layout/HomePage.css";

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <main className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-content">
          <h1>Find the right movie for you</h1>
          <p>With Movie Mood, you can find a movie that matches your mood. Anywhere. Anytime.</p>
          <button className="hero-btn">Find By Mood</button>
        </div>
      </main>

      <section className="spotlight">
        <h2>How Does Movie Mood Work?</h2>
        <div className="spotlight-inner">
          <div className="features">
            <div className="feature-card">
              <img src={featA} alt="Pick mood" className="feature-img" />
              <p>Tell us how you feel and we'll match movies to your vibe.</p>
            </div>
            <div className="feature-card">
              <img src={featA} alt="Curated lists" className="feature-img" />
              <p>We’ll give you a list of movies tailored to your tastes.</p>
            </div>
            <div className="feature-card">
              <img src={featA} alt="Save and share" className="feature-img" />
              <p>Find the best movie for you and save favorites to your watchlist.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
