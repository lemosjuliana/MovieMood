// MoodSelector.tsx
import { useState } from "react";
import { findByMood } from "../api/movies";
import type { MovieDetails } from "../api/movies";
import TimeFilter from "./TimeFilter";
import MovieCard from "./MovieCard";
import "./Layout/FindMoviesPage.css";

const MOODS = ["Happy", "Peaceful", "Energetic", "Anxious", "Thankful"];

type MoodSelectorProps = {
  onAddToWatchlist?: (movie: MovieDetails) => void;
};

export default function MoodSelector({ onAddToWatchlist }: MoodSelectorProps) {
  const [selected, setSelected] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(120);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MovieDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  const email = (typeof window !== "undefined" && localStorage.getItem("mm_email")) || "";

  async function fetchForMood(mood: string, maxMin?: number) {
    setError(null);
    setLoading(true);
    try {
      const data = await findByMood(mood, 3, maxMin);
      setResults(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Failed to fetch movies");
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

  async function handleSurprise() {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    await handleSelect(randomMood);
  }

  // ---- Add to Watchlist: calls parent callback ----
  async function addTitle(movie: MovieDetails): Promise<boolean> {
    if (!email) {
      alert("Please log in to use your watchlist.");
      return false;
    }
    try {
      const res = await fetch("http://localhost:4000/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, title: movie.Title }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to add to watchlist");

      // ✅ Call the callback to update parent state
      if (onAddToWatchlist) onAddToWatchlist(movie);

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message || "Could not add to watchlist");
      else alert("Could not add to watchlist");
      return false;
    }
  }

  return (
    <section className="mood-selector">
      <h2>Pick your mood</h2>

      <div className="mood-grid">
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => handleSelect(m)}
            className={`mood-btn mood-${m.toLowerCase()} ${selected === m ? "selected" : ""}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="surprise-wrapper">
        <button className="mood-btn surprise-btn" onClick={handleSurprise} aria-label="Surprise me">
          Surprise Me!
        </button>
      </div>

      <TimeFilter minutes={minutes} setMinutes={setMinutes} onApply={handleApplyTime} />

      {loading && <p className="loading">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid" style={{ marginTop: 16 }}>
        {results.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onAddToWatchlist={() => addTitle(movie)}
          />
        ))}
      </div>
    </section>
  );
}
