import express from "express";
import cors from "cors";
import { findByMood, surpriseMe } from "./movies.js";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Endpoint to get movies by mood
app.get("/api/movies", async (req, res) => {
  const mood = req.query.mood;
  const maxMin = req.query.maxMin ? Number(req.query.maxMin) : undefined;

  if (!mood) return res.status(400).json({ error: "Mood is required" });

  try {
    const movies = await findByMood(mood, 3, maxMin);
    res.json(movies);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Endpoint for surprise me
app.get("/api/surprise", async (req, res) => {
  try {
    const movie = await surpriseMe();
    res.json(movie);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch surprise movie" });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
