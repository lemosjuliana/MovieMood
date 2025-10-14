import React, { createContext, useState, useContext, useEffect } from "react";
import type { MovieDetails } from "../api/movies";

type WatchlistContextType = {
  movies: MovieDetails[];
  refresh: () => void; // to reload from backend
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const email = localStorage.getItem("mm_email") || "";

  // Fetch watchlist from backend
  const refresh = async () => {
    if (!email) return;
    try {
      const res = await fetch(`http://localhost:4000/api/watchlist?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setMovies(data.items || []);
    } catch (err) {
      console.error("Failed to load watchlist:", err);
    }
  };

  useEffect(() => {
    refresh();
  }, [email]);

  return (
    <WatchlistContext.Provider value={{ movies, refresh }}>
      {children}
    </WatchlistContext.Provider>
  );
};

// Hook to use the context in any component
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used within WatchlistProvider");
  return context;
};
