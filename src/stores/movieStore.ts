import { create } from "zustand";
import { getListMovie, getMoviesBySearch } from "@/services/movies.service";

type MovieItem = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

interface MovieState {
  movies: MovieItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  suggestions: MovieItem[];
  isFetchingSuggestions: boolean;
  fetchMovies: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  fetchSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

export const useMoviesStore = create<MovieState>((set, get) => ({
  movies: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  suggestions: [],
  isFetchingSuggestions: false,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  clearSuggestions: () => set({ suggestions: [] }),

  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentSearchQuery = get().searchQuery;
      let responseData;

      if (currentSearchQuery) {
        const searchResponse = await getMoviesBySearch(currentSearchQuery);
        responseData = searchResponse.results || [];
      } else {
        const defaultResponse = await getListMovie();
        responseData = defaultResponse.results || [];
      }
      set({ movies: responseData, isLoading: false });
    } catch (err: unknown) {


      let errorMessage = "An unknown error occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        errorMessage = (err as any).message;
      }

      set({ error: errorMessage || "Failed to load movies", isLoading: false });
    }
  },
  fetchSuggestions: async (query: string) => {
    if (query.length < 3) {
      set({ suggestions: [], isFetchingSuggestions: false });
      return;
    }
    set({ isFetchingSuggestions: true });
    try {
      const response = await getMoviesBySearch(query);
      set({
        suggestions: response.results?.slice(0, 7) || [],
        isFetchingSuggestions: false,
      });
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      set({ suggestions: [], isFetchingSuggestions: false });
    }
  },
}));
