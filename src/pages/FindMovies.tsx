import React from "react";
import MoodSelector from "../components/MoodSelector";
import "../components/Layout/FindMoviesPage.css";

const FindMovies: React.FC = () => {
    return (
        <main className="findmovies-page">
            <h1 className="findmovies-title">What's your mood today?</h1>
            <MoodSelector />
        </main>
    );
};
export default FindMovies;
