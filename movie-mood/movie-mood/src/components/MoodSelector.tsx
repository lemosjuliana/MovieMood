import { useState } from "react";
import { searchMovies } from "../api/movies";

const moods = ["Happy", "Peaceful", "Energetic", "Anxious"]; //can be a txt list we pull from later

export default function MoodSelector() {
  const [selected, setSelected] = useState("");
  const [movies, setMovies] = useState<any[]>([]);

  async function handleSelect(mood: string) {
    setSelected(mood);
    const data = await searchMovies(mood); 
    setMovies(data);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Pick a mood</h2>
      <div className="flex gap-2">
        {moods.map(m => (
          <button
            key={m}
            className={`px-3 py-1 rounded ${
              selected === m ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleSelect(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {movies.slice(0, 3).map(movie => (
          <div key={movie.imdbID} className="border p-2 rounded mb-2">
            <h3>{movie.Title} ({movie.Year})</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
