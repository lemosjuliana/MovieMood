import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { findByMood, surpriseMe } from "./movies.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ----------------- Supabase client -----------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key required for insert
);

// ----------------- User signup -----------------
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into "profiles" table
    const { error } = await supabase.from("profiles").insert([
      { email, password: hashedPassword },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: "User created!" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ----------------- User login -----------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    // Get the user from the "profiles" table
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, data.password);

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    // Success
    res.json({ success: true, message: "Logged in!", user: { email: data.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ----------------- Movie endpoints -----------------
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