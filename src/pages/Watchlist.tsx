import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LogoutButton from "../components/LogoutButton";
import MoodSelector from "../components/MoodSelector"; // <-- import MoodSelector
import type { MovieDetails } from "../api/movies";
import { BACKEND_URL } from "../api/config"; // <-- import backend URL

const getCurrentEmail = () => localStorage.getItem("mm_email") || "";

type TitleRow = {
  id: string;
  title: string;
  created_at: string;
};

export default function Watchlist() {
  const [titles, setTitles] = useState<TitleRow[]>([]);
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const email = getCurrentEmail();

  async function load() {
    console.log("Loading watchlist...", email);
    try {
      const tRes = await fetch(`${BACKEND_URL}/api/watchlist?email=${encodeURIComponent(email)}`);
      console.log("Response status:", tRes.status);
      const tJson = await tRes.json();
      console.log("Watchlist JSON:", tJson);
      if (!tRes.ok) throw new Error(tJson.error || "Failed to load watchlist");
      setTitles(tJson.items);

      const details = await Promise.all(
        tJson.items.map(async (row: TitleRow) => {
          const r = await fetch(`${BACKEND_URL}/api/movieByTitle?title=${encodeURIComponent(row.title)}`);
          return r.ok ? (await r.json()) as MovieDetails : null;
        })
      );
      setMovies(details.filter(Boolean) as MovieDetails[]);
      console.log("Loaded movies:", details);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!email) {
      window.location.href = "/login";
    } else {
      load();
    }
  }, [email]);

  async function remove(movie: MovieDetails) {
    console.log("Removing movie:", movie.Title);
    try {
      const r = await fetch(`${BACKEND_URL}/api/watchlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, title: movie.Title }),
      });
      if (!r.ok) throw new Error((await r.json()).error || "Failed to remove");
      setTitles(xs => xs.filter(x => x.title !== movie.Title));
      setMovies(xs => xs.filter(m => m.Title !== movie.Title));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove");
    }
  }

  async function add(movie: MovieDetails) {
    console.log("Adding movie:", movie.Title);
    try {
      const r = await fetch(`${BACKEND_URL}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, title: movie.Title }),
      });
      const j = await r.json();
      console.log("Add movie response:", j);
      if (!r.ok) throw new Error(j.error || "Failed to add");
      setTitles(xs => [...xs, { id: j.item.id, title: movie.Title, created_at: j.item.created_at }]);
      setMovies(xs => [...xs, movie]);
      return true;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add");
      return false;
    }
  }

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (err) return <main style={{ padding: 24 }}>Error: {err}</main>;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Your Watchlist</h1>
        <LogoutButton />
      </div>

      {/* --- MoodSelector rendered here, passing `add` as callback --- */}
     

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginTop: 24 }}>
        {movies.map(m => (
          <MovieCard
            key={m.imdbID}
            movie={m}
            isInWatchlist={true}
            onRemoveFromWatchlist={remove}
            onAddToWatchlist={add}
          />
        ))}
        {movies.length === 0 && <p>No titles yet.</p>}
      </div>
    </main>
  );
}
