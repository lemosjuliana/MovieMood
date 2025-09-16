import axios from "axios";

const API_KEY = "90ce15d4"; // get from omdbapi.com
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query: string) {
  const res = await axios.get(BASE_URL, {
    params: { apikey: API_KEY, s: query, type: "movie" },
  });
  return res.data.Search || [];
}
