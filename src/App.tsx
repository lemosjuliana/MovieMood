import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";
import FindMovies from "./pages/FindMovies";
import About from "./pages/About"; 
import CreateAccount from "./pages/CreateAccount";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-movies" element={<FindMovies />} />
        <Route path="/my-list" element={<Watchlist />} /> {/* <-- changed path */}
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/profile" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
