import React from "react";
import aboutImg from "../assets/about.jpg";
import "../components/Layout/AboutPage.css";

const About: React.FC = () => {
  return (
    <div>
      <main style={{ padding: "40px", fontFamily: "'Open Sans', sans-serif", color: "white" }}>
        <h1>Welcome to Movie Mood!</h1>
        <p>Have you ever planned a movie night with family or friends, only to spend ages trying to find a movie worth watching?</p>
        <p>The reality is that factors like our mood, the people we're watching with, and the time available to watch can make choosing a movie frustrating and time-consuming. Movie Mood is an app that makes it easier to select content worth watching based on your mood, your time availability, and more.</p>
        <p>With Movie Mood, you can find a movie that matches your mood. Anywhere. Anytime.</p>
  <img className="about-img" src={aboutImg} alt="About Image" />
      </main>
    </div>
  );
};

export default About;
