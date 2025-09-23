import axios from "axios";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

const API_KEY = process.env.OMDB_KEY;
if (!API_KEY) throw new Error("Missing OMDB_KEY env var");

console.log("OMDb API Key:", API_KEY);


const BASE_URL = "https://www.omdbapi.com/";

// Functions
function assertApiKey() {
  if (!API_KEY) throw new Error("Missing OMDB_KEY env var");
}

export async function searchByQuery(query, page = 1) {
  assertApiKey();
  const res = await axios.get(BASE_URL, {
    params: { apikey: API_KEY, s: query, type: "movie", page },
  });
  if (res.data?.Response === "False") return [];
  return res.data.Search ?? [];
}

export async function getById(imdbID) {
  assertApiKey();
  const res = await axios.get(BASE_URL, {
    params: { apikey: API_KEY, i: imdbID, plot: "short" },
  });
  return res.data?.Response === "True" ? res.data : null;
}

export async function findByMood(mood, limit = 3, maxMinutes) {
  const basic = await searchByQuery(mood, 1);
  const details = await Promise.all(basic.slice(0, 10).map(m => getById(m.imdbID)));
  const cleaned = details.filter(Boolean).map(d => ({
    ...d,
    runtimeMin: parseInt(d.Runtime, 10) || NaN,
  }));

  const filtered = typeof maxMinutes === "number"
    ? cleaned.filter(d => !Number.isNaN(d.runtimeMin) && d.runtimeMin <= maxMinutes)
    : cleaned;

  return filtered.slice(0, limit);
}

export async function surpriseMe(mood = "random") {
  const query = mood === "random" ? "movie" : mood;
  const page = Math.max(1, Math.floor(Math.random() * 3) + 1);
  const list = await searchByQuery(query, page);
  if (list.length === 0) return null;
  const pick = list[Math.floor(Math.random() * list.length)];
  return getById(pick.imdbID);
}
