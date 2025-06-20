import { create } from 'zustand';
import { getListMovie } from '@/services/movies.service';

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
    fetchMovies: () => Promise<void>;
    setSearchQuery: (query: string) => void; 
}

export const useMoviesStore = create<MovieState>((set, get) => ({
    movies: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    setSearchQuery: (query: string) => set({ searchQuery: query }),
    fetchMovies: async () => {

        set({ isLoading: true, error: null });

        try {
            const currentSearchQuery = get().searchQuery;

            let responseData;
            if (currentSearchQuery) {
                console.log(`Fetching movies for search query: ${currentSearchQuery}`);

                const searchResponse = await getListMovie();
                responseData = searchResponse.results?.filter((movie: MovieItem) =>
                    movie.title.toLowerCase().includes(currentSearchQuery.toLowerCase())
                ) || [];

            } else {
                const defaultResponse = await getListMovie();
                responseData = defaultResponse.results || [];
            }

            set({ movies: responseData, isLoading: false });

        } catch (err: any) {
            console.error("Failed to fetch movies in store:", err);
            set({ error: err.message || "Failed to load movies", isLoading: false });
        }
    },
}));