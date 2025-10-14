import { useState } from "react";
import type { MovieDetails } from "../api/movies";
import "../components/Layout/MovieCard.css";

type Props = {
  movie: MovieDetails;
  onAddToWatchlist?: (movie: MovieDetails) => Promise<boolean>;
  onRemoveFromWatchlist?: (movie: MovieDetails) => void;
  isInWatchlist?: boolean;
};

export default function MovieCard({
  movie,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist = false,
}: Props) {
  const [added, setAdded] = useState(false);

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x445?text=No+Poster";

  const handleAdd = async () => {
    console.log("Add button clicked for", movie.Title);
    if (onAddToWatchlist) {
      const success = await onAddToWatchlist(movie);
      console.log("Add movie result:", success);
      if (success) setAdded(true);
    }
  };

  const handleRemove = () => {
    console.log("Remove button clicked for", movie.Title);
    if (onRemoveFromWatchlist) onRemoveFromWatchlist(movie);
    setAdded(false);
  };

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img src={poster} alt={movie.Title} className="poster" />
        {!isInWatchlist && (
          <button
            className={`add-btn ${added ? "added" : ""}`}
            onClick={handleAdd}
            title={added ? "Added to Watchlist" : "Add to Watchlist"}
            disabled={added}
          >
            {added ? "✔" : "＋"}
          </button>
        )}
        {isInWatchlist && onRemoveFromWatchlist && (
          <button onClick={handleRemove} style={{ marginTop: 8 }}>
            Remove
          </button>
        )}
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
