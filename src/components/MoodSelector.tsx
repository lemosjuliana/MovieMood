import { useState } from "react";
import { findByMood } from "../api/movies";
import type { MovieDetails } from "../api/movies";
import TimeFilter from "./TimeFilter";
import MovieCard from "./MovieCard";

const MOODS = ["Happy", "Peaceful", "Energetic", "Anxious", "Thankful"]; //place holders, can be changed later

export default function MoodSelector() {
  const [selected, setSelected] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(120);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MovieDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchForMood(mood: string, maxMin?: number) {
    setError(null);
    setLoading(true);
    try {
      const data = await findByMood(mood, 3, maxMin);
      setResults(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to fetch movies");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(mood: string) {
    setSelected(mood);
    await fetchForMood(mood, minutes);
  }

  async function handleApplyTime() {
    if (selected) await fetchForMood(selected, minutes);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Pick your mood</h2>

      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => handleSelect(m)}
            className={`px-3 py-1 rounded border ${
              selected === m ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <TimeFilter minutes={minutes} setMinutes={setMinutes} onApply={handleApplyTime} />

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-3 md:grid-cols-3">
        {results.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </section>
  );
}
