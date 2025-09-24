import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// API keys
const TMDB_KEY = process.env.TMDB_KEY;
const OMDB_KEY = process.env.OMDB_KEY;



if (!TMDB_KEY) throw new Error("Missing TMDB_KEY env var");
if (!OMDB_KEY) throw new Error("Missing OMDB_KEY env var");

// Base URLs
const TMDB_BASE = "https://api.themoviedb.org/3";
const OMDB_BASE = "https://www.omdbapi.com/";

// Mood to TMDb genre IDs
const moodToGenreId = {
  Happy: 35,       // Comedy
  Energetic: 28,   // Action
  Anxious: 27,     // Horror
  Peaceful: 18,    // Drama
  Thankful: 10749, // Romance
};

// Helper: get basic movie list from TMDb
async function getMoviesByGenre(genreId, limit = 3) {
  const res = await axios.get(`${TMDB_BASE}/discover/movie`, {
    params: {
      api_key: TMDB_KEY,
      with_genres: genreId,
      sort_by: "popularity.desc",
      page: 1,
    },
  });
  return res.data.results.slice(0, limit);
}

// Helper: get detailed info from OMDb using movie title
async function getMovieDetailsFromOMDb(title) {
  const res = await axios.get(OMDB_BASE, {
    params: {
      apikey: OMDB_KEY,
      t: title,
      type: "movie",
    },
  });

  if (res.data.Response === "False") return null;

  return {
    Title: res.data.Title,
    Year: res.data.Year,
    Rated: res.data.Rated,
    Runtime: res.data.Runtime,
    Genre: res.data.Genre,
    Plot: res.data.Plot,
    Poster: res.data.Poster,
    imdbID: res.data.imdbID,
  };
}


export async function findByMood(mood, limit = 3, maxMinutes) {
  const genreId = moodToGenreId[mood];
  if (!genreId) throw new Error(`Unknown mood: ${mood}`);

  // Step 1: Get movies from TMDb
  const tmdbMovies = await getMoviesByGenre(genreId, limit * 2);

  // Step 2: Get details from OMDb
  const detailedMovies = [];
  for (const movie of tmdbMovies) {
    const details = await getMovieDetailsFromOMDb(movie.title);
    if (!details) continue;


    if (maxMinutes) {
      const runtimeMatch = details.Runtime.match(/(\d+) min/);
      const runtimeMin = runtimeMatch ? parseInt(runtimeMatch[1], 10) : NaN;
      if (!isNaN(runtimeMin) && runtimeMin > maxMinutes) continue;
    }

    detailedMovies.push(details);
    if (detailedMovies.length >= limit) break;
  }

  return detailedMovies;
}


export async function surpriseMe(mood = "random") {
  const moods = Object.keys(moodToGenreId);
  const selectedMood = mood === "random" ? moods[Math.floor(Math.random() * moods.length)] : mood;
  const movies = await findByMood(selectedMood, 1);
  return movies.length > 0 ? movies[0] : null;
}
