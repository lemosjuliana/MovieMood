

export type MovieSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type MovieDetails = {
  Title: string;
  Year: string;
  Rated: string;
  Runtime: string;
  Genre: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Type?: string;
};

const BACKEND_URL = "http://localhost:4000/api";

// Call backend instead of OMDb directly
export async function findByMood(mood: string, limit = 3, maxMinutes?: number): Promise<MovieDetails[]> {
  const params = new URLSearchParams({ mood, limit: String(limit) });
  if (maxMinutes) params.append("maxMin", String(maxMinutes));

  const res = await fetch(`${BACKEND_URL}/movies?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function surpriseMe(): Promise<MovieDetails | null> {
  const res = await fetch(`${BACKEND_URL}/surprise`);
  if (!res.ok) throw new Error("Failed to fetch surprise movie");
  return res.json();
}
