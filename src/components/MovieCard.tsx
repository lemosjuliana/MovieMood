import { useState } from "react";
import type { MovieDetails } from "../api/movies";
import "../components/Layout/MovieCard.css";

type Props = {
  movie: MovieDetails;
  onAddToWatchlist?: (movie: MovieDetails) => void;
};

export default function MovieCard({ movie, onAddToWatchlist }: Props) {
  const [added, setAdded] = useState(false);

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x445?text=No+Poster";

  const handleAdd = () => {
    setAdded(true);
    onAddToWatchlist?.(movie);
  };

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img src={poster} alt={movie.Title} className="poster" />

        <button
          className={`add-btn ${added ? "added" : ""}`}
          onClick={handleAdd}
          title={added ? "Added to Watchlist" : "Add to Watchlist"}
          disabled={added}
        >
          {added ? "✔" : "＋"}
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">
          {movie.Title} <span className="movie-year">({movie.Year})</span>
        </h3>
        <p className="movie-meta">
          Rated: {movie.Rated || "N/A"} • {movie.Runtime}
        </p>
        {movie.Plot && <p className="movie-plot">{movie.Plot}</p>}
      </div>
    </article>
  );
}
