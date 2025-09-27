// import MoodSelector from "./components/MoodSelector";

// export default function App() {
//   return (
//     <main className="min-h-dvh p-6">
//       <h1 className="text-3xl font-bold mb-6">🎬 Movie Mood</h1>
//       <MoodSelector />
//     </main>
//   );
// }

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";
import FindMovies from "./pages/FindMovies";
import About from "./pages/About"; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-movies" element={<FindMovies />} />
        <Route path="/my-list" element={<Watchlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

