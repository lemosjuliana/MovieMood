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

// Enhanced mood mapping with multiple genres and exclusions
const moodConfig = {
  Happy: {
    genres: [35, 10751, 16], // Comedy, Family, Animation
    exclude: [27, 53, 80], // No Horror, Thriller, Crime
    keywords: ["feel-good", "uplifting"],
    minRating: 6.5,
  },
  Energetic: {
    genres: [28, 12, 878], // Action, Adventure, Sci-Fi
    exclude: [18, 10749], // No Drama, Romance
    minRating: 6.0,
  },
  Anxious: {
    genres: [27, 53, 9648], // Horror, Thriller, Mystery
    exclude: [35, 10751], // No Comedy, Family
    minRating: 6.0,
  },
  Peaceful: {
    genres: [18, 10751, 36, 99], // Drama, Family, History, Documentary
    exclude: [27, 28, 53, 80], // No Horror, Action, Thriller, Crime
    keywords: ["inspiring", "heartwarming", "quiet"],
    minRating: 7.0,
    maxRating: 10, // Quality filter for peaceful content
  },
  Thankful: {
    genres: [10749, 18, 10751], // Romance, Drama, Family
    exclude: [27, 53, 80], // No Horror, Thriller, Crime
    keywords: ["heartwarming", "love", "family"],
    minRating: 6.8,
  },
};

// Cache to prevent duplicate recommendations - stores per mood
const recentlyRecommendedByMood = new Map();
const CACHE_SIZE_PER_MOOD = 30;

// Track which pages we've used for each mood
const usedPagesByMood = new Map();

// Helper: Get movies with variety (random pages)
async function getMoviesByMood(mood, limit = 10) {
  const config = moodConfig[mood];
  if (!config) throw new Error(`Unknown mood: ${mood}`);

  // Initialize tracking for this mood if needed
  if (!recentlyRecommendedByMood.has(mood)) {
    recentlyRecommendedByMood.set(mood, new Set());
  }
  if (!usedPagesByMood.has(mood)) {
    usedPagesByMood.set(mood, new Set());
  }

  const usedPages = usedPagesByMood.get(mood);
  
  // Pick a page we haven't used recently (cycles through 1-10)
  let randomPage;
  if (usedPages.size >= 10) {
    usedPages.clear(); // Reset after using all pages
  }
  
  do {
    randomPage = Math.floor(Math.random() * 10) + 1;
  } while (usedPages.has(randomPage) && usedPages.size < 10);
  
  usedPages.add(randomPage);

  const allMovies = [];

  // Try each genre in the mood
  for (const genreId of config.genres) {
    try {
      const res = await axios.get(`${TMDB_BASE}/discover/movie`, {
        params: {
          api_key: TMDB_KEY,
          with_genres: genreId,
          without_genres: config.exclude?.join(","),
          "vote_average.gte": config.minRating || 6.0,
          "vote_average.lte": config.maxRating || 10,
          "vote_count.gte": 100, // Ensure movies have enough ratings
          sort_by: "vote_average.desc",
          page: randomPage,
        },
      });
      allMovies.push(...res.data.results);
    } catch (error) {
      console.error(`Error fetching genre ${genreId}:`, error.message);
    }
  }

  const recentlyRecommended = recentlyRecommendedByMood.get(mood);

  // Remove duplicates and recently recommended
  const uniqueMovies = allMovies.filter((movie, index, self) => {
    const isDuplicate = self.findIndex((m) => m.id === movie.id) !== index;
    const wasRecentlyRecommended = recentlyRecommended.has(movie.id);
    return !isDuplicate && !wasRecentlyRecommended;
  });

  // Shuffle for variety
  const shuffled = uniqueMovies.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}

// Helper: Get detailed info from OMDb
async function getMovieDetailsFromOMDb(title, year) {
  try {
    const res = await axios.get(OMDB_BASE, {
      params: {
        apikey: OMDB_KEY,
        t: title,
        y: year, // Include year for better matching
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
      imdbRating: res.data.imdbRating,
    };
  } catch (error) {
    console.error(`Error fetching OMDb details for ${title}:`, error.message);
    return null;
  }
}

// Enhanced mood filter with better matching
export async function findByMood(mood, limit = 3, maxMinutes) {
  const config = moodConfig[mood];
  if (!config) throw new Error(`Unknown mood: ${mood}`);

  // Get more movies than needed to account for filtering
  const tmdbMovies = await getMoviesByMood(mood, limit * 4);

  const detailedMovies = [];
  const recentlyRecommended = recentlyRecommendedByMood.get(mood);

  for (const movie of tmdbMovies) {
    // Skip if we already have enough
    if (detailedMovies.length >= limit) break;

    // Extract year from release_date
    const year = movie.release_date?.split("-")[0];
    const details = await getMovieDetailsFromOMDb(movie.title, year);

    if (!details) continue;

    // Runtime filter
    if (maxMinutes) {
      const runtimeMatch = details.Runtime.match(/(\d+) min/);
      const runtimeMin = runtimeMatch ? parseInt(runtimeMatch[1], 10) : NaN;
      if (!isNaN(runtimeMin) && runtimeMin > maxMinutes) continue;
    }

    // Content rating filter for Peaceful mood
    if (mood === "Peaceful") {
      const inappropriateRatings = ["R", "NC-17"];
      if (inappropriateRatings.includes(details.Rated)) continue;
    }

    // Add to mood-specific cache to prevent future duplicates
    recentlyRecommended.add(movie.id);
    if (recentlyRecommended.size > CACHE_SIZE_PER_MOOD) {
      const firstItem = recentlyRecommended.values().next().value;
      recentlyRecommended.delete(firstItem);
    }

    detailedMovies.push(details);
  }

  return detailedMovies;
}

// Surprise me with better variety
export async function surpriseMe(mood = "random") {
  const moods = Object.keys(moodConfig);
  const selectedMood =
    mood === "random"
      ? moods[Math.floor(Math.random() * moods.length)]
      : mood;

  const movies = await findByMood(selectedMood, 1);
  return movies.length > 0 ? movies[0] : null;
}

// Optional: Clear the recommendation cache for a specific mood or all moods
export function clearRecommendationCache(mood = null) {
  if (mood) {
    recentlyRecommendedByMood.get(mood)?.clear();
    usedPagesByMood.get(mood)?.clear();
  } else {
    recentlyRecommendedByMood.clear();
    usedPagesByMood.clear();
  }
}

// Wrapper for the watchlist
export async function getDetailsByTitle(title, year) {
  return await getMovieDetailsFromOMDb(title, year); 
}
