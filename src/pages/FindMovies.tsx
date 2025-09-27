import React from "react";
import MoodSelector from "../components/MoodSelector";

const FindMovies: React.FC = () => {
    return (
        <main className="min-h-dvh p-6">
            <h1 className="text-3xl font-bold mb-6">🎬 Movie Mood</h1>
            <MoodSelector />
        </main>
    );
};
export default FindMovies;
