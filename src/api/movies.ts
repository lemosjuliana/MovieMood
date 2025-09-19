import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_KEY as string;
const BASE_URL = "https://www.omdbapi.com/";

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

function assertApiKey() {
  if (!API_KEY) throw new Error("Missing VITE_OMDB_KEY env var");
}

export async function searchByQuery(query: string, page = 1): Promise<MovieSearchItem[]> {
  assertApiKey();
  const res = await axios.get(BASE_URL, {
    params: { apikey: API_KEY, s: query, type: "movie", page },
  });
  if (res.data?.Response === "False") return [];
  return res.data.Search ?? [];
}

export async function getById(imdbID: string): Promise<MovieDetails | null> {
  assertApiKey();
  const res = await axios.get(BASE_URL, {
    params: { apikey: API_KEY, i: imdbID, plot: "short" },
  });
  return res.data?.Response === "True" ? (res.data as MovieDetails) : null;
}

export async function findByMood(mood: string, limit = 3, maxMinutes?: number): Promise<MovieDetails[]> {
  const basic = await searchByQuery(mood, 1);
  const details = await Promise.all(basic.slice(0, 10).map((m) => getById(m.imdbID)));
  const cleaned = (details.filter(Boolean) as MovieDetails[]).map((d) => ({
    ...d,
    runtimeMin: parseInt(d.Runtime, 10) || NaN,
  })) as (MovieDetails & { runtimeMin: number })[];

  const filtered =
    typeof maxMinutes === "number"
      ? cleaned.filter((d) => !Number.isNaN(d.runtimeMin) && d.runtimeMin <= maxMinutes)
      : cleaned;

  return filtered.slice(0, limit);
}

export async function surpriseMe(mood = "random"): Promise<MovieDetails | null> {
  const query = mood === "random" ? "movie" : mood;
  const page = Math.max(1, Math.floor(Math.random() * 3) + 1);
  const list = await searchByQuery(query, page);
  if (list.length === 0) return null;
  const pick = list[Math.floor(Math.random() * list.length)];
  return getById(pick.imdbID);
}
