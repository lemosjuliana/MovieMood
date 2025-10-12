import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import type { MovieDetails } from "../api/movies";

const getCurrentEmail = () => localStorage.getItem("mm_email") || ""; // replace with real auth email

type TitleRow = { id: string; title: string; created_at: string };

export default function Watchlist() {
  const [, setTitles] = useState<TitleRow[]>([]);
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const email = getCurrentEmail();

  async function load() {
    setLoading(true); setErr(null);
    try {
      // 1) fetch titles
      const tRes = await fetch(`/api/watchlist?email=${encodeURIComponent(email)}`);
      const tJson = await tRes.json();
      if (!tRes.ok) throw new Error(tJson.error || "Failed to load watchlist");
      setTitles(tJson.items);

      // 2) fetch details for each title in parallel
      const details = await Promise.all(
        (tJson.items as TitleRow[]).map(async (row) => {
          const r = await fetch(`/api/movieByTitle?title=${encodeURIComponent(row.title)}`);
          return r.ok ? ((await r.json()) as MovieDetails) : null;
        })
      );
      setMovies(details.filter(Boolean) as MovieDetails[]);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Failed to load watchlist");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (email) load(); }, [email]);

  async function remove(title: string) {
    const r = await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, title }),
    });
    if (r.ok) {
      setTitles((xs) => xs.filter((x) => x.title !== title));
      setMovies((xs) => xs.filter((m) => m.Title !== title));
    } else {
      const j = await r.json();
      alert(j.error || "Failed to remove");
    }
  }

  if (!email) return <main style={{ padding: 24 }}>Please log in to view your watchlist.</main>;
  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (err) return <main style={{ padding: 24 }}>Error: {err}</main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Your Watchlist</h1>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {movies.map((m) => (
          <div key={m.imdbID}>
            <MovieCard movie={m} /> {/* reuses your component */}
            <button onClick={() => remove(m.Title)} style={{ marginTop: 8 }}>
              Remove
            </button>
          </div>
        ))}
        {movies.length === 0 && <p>No titles yet.</p>}
      </div>
    </main>
  );
}
