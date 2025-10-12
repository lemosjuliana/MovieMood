import { useEffect, useState } from "react";
import "../components/Layout/WatchlistPage.css";

type StoredMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster?: string;
};

export default function Watchlist() {
  const [movies, setMovies] = useState<StoredMovie[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("watchlist");
    if (raw) {
      try {
        setMovies(JSON.parse(raw));
      } catch {
        setMovies([]);
      }
    }
  }, []);

  function save(newList: StoredMovie[]) {
    setMovies(newList);
    localStorage.setItem("watchlist", JSON.stringify(newList));
  }

  function handleRemove(id: string) {
    const filtered = movies.filter((m) => m.imdbID !== id);
    save(filtered);
  }

  if (movies.length === 0) {
    return (
      <main className="watchlist-page">
        <h1>Your Watchlist</h1>
        <p>Your watchlist is empty. Add movies from the Find Movies page.</p>
      </main>
    );
  }

  return (
    <main className="watchlist-page">
      <h1>Your Watchlist</h1>
      <ul className="watchlist-grid">
        {movies.map((m) => (
          <li key={m.imdbID} className="watchlist-item">
            <img src={m.Poster || "https://via.placeholder.com/150x225?text=No+Poster"} alt={m.Title} className="watchlist-poster" />
            <div className="watchlist-info">
              <div className="watchlist-top">
                <strong className="watchlist-title">{m.Title}</strong>
                <button className="remove-btn" onClick={() => handleRemove(m.imdbID)} aria-label={`Remove ${m.Title}`}>
                  ✕
                </button>
              </div>
              <div className="watchlist-bottom">
                <span className="watchlist-year">{m.Year}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
