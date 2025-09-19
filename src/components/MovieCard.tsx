import type { MovieDetails } from "../api/movies";

type Props = { movie: MovieDetails };

export default function MovieCard({ movie }: Props) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x445?text=No+Poster";

  return (
    <article className="border rounded p-3">
      <img
        src={poster}
        alt={movie.Title}
        className="w-full h-64 object-cover rounded mb-2"
      />
      <h3 className="font-semibold">
        {movie.Title} ({movie.Year})
      </h3>
      <p className="text-sm">Rated: {movie.Rated || "N/A"} • {movie.Runtime}</p>
      {movie.Plot && <p className="text-sm mt-1 line-clamp-3">{movie.Plot}</p>}
    </article>
  );
}
