// src/components/MoodSelector.tsx
import { useState } from "react";
import { findByMood } from "../api/movies";
import type { MovieDetails } from "../api/movies";
import TimeFilter from "./TimeFilter";
import MovieCard from "./MovieCard";

const MOODS = ["Happy", "Peaceful", "Energetic", "Anxious", "Thankful"];

export default function MoodSelector() {
  const [selected, setSelected] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(120);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MovieDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  // If you store the logged-in user's email after login, read it here.
  // Replace with your real auth source if different.
  const email = (typeof window !== "undefined" && localStorage.getItem("mm_email")) || "";

  async function fetchForMood(mood: string, maxMin?: number) {
    setError(null);
    setLoading(true);
    try {
      const data = await findByMood(mood, 3, maxMin);
      setResults(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message ?? "Failed to fetch movies");
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

  // ---- Add to Watchlist: calls your Express backend ----
  async function addTitle(title: string) {
    if (!email) {
      alert("Please log in to use your watchlist.");
      return;
    }
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, title }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Failed to add to watchlist");
      }
      // Optional: toast/success UI here
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Could not add to watchlist");
      } else {
        alert("Could not add to watchlist");
      }
    }
  }

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Pick your mood</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => handleSelect(m)}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid #2a2f3b",
              background: selected === m ? "#6ea8ff" : "#151924",
              color: selected === m ? "#0b1225" : "#e6eaf2",
              cursor: "pointer",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <TimeFilter minutes={minutes} setMinutes={setMinutes} onApply={handleApplyTime} />

      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}
      {error && (
        <p style={{ marginTop: 12, color: "#ffb4b4" }}>
          {error}
        </p>
      )}

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {results.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onAddToWatchlist={() => addTitle(movie.Title)}
          />
        ))}
      </div>
    </section>
  );
}
