import { create } from 'zustand';
import { getPopularMovies, getNowPlayingMovies, getTopRatedMovies, getUpcomingMovies, getMoviesBySearch } from '@/services/movies.service';
import { MovieItem, MovieListApiResponse, MovieCategory } from '@/lib/types'; // Asumsi MovieCategory ada di sini

interface AppMovieState {
    movies: MovieItem[];
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    searchQuery: string;
    suggestions: MovieItem[];
    isFetchingSuggestions: boolean;
    currentPage: number;
    totalPages: number;
    currentCategory: MovieCategory;

    setSearchQuery: (query: string) => void;
    clearSuggestions: () => void;
    clearSearchResults: () => void;
    fetchMovies: (category?: MovieCategory, page?: number, append?: boolean) => Promise<void>;
    fetchSuggestions: (query: string) => Promise<void>;
    setCategory: (category: MovieCategory) => void;
    loadMoreMovies: () => Promise<void>;
}

export const useMoviesStore = create<AppMovieState>((set, get) => ({
    movies: [],
    isLoading: false,
    isFetchingMore: false,
    error: null,
    searchQuery: '',
    suggestions: [],
    isFetchingSuggestions: false,
    currentPage: 0,
    totalPages: 1,
    currentCategory: 'popular',
    setSearchQuery: (query: string) => {
        set({ searchQuery: query })
    },
    clearSuggestions: () => set({ suggestions: [] }),

    clearSearchResults: () => {
        set({
            searchQuery: '',
            currentPage: 1,
            totalPages: 1,
            currentCategory: 'popular',
            movies: [],
        });
        get().fetchMovies('popular', 1);
    },

    fetchMovies: async (category?: MovieCategory, page: number = 1, append: boolean = false) => {
        const state = get();
        
        if (state.isLoading && !append) return;
        if (state.isFetchingMore && append) return;
        if (append && state.currentPage >= state.totalPages) return;

        set(append ? { isFetchingMore: true } : { isLoading: true, error: null });

        let activeCategory: MovieCategory = category || state.currentCategory;
        let queryToUse = state.searchQuery;

        console.log({activeCategory});
        

        if (queryToUse && queryToUse.length > 0) {
            activeCategory = 'search';
        } else if (!category) {
             activeCategory = state.currentCategory;
        }

        try {
            let response: MovieListApiResponse;
            const targetPage = append ? state.currentPage + 1 : page;

            switch (activeCategory) {
                case 'search':
                    if (!queryToUse) throw new Error("Search query is empty for 'search' category.");
                    response = await getMoviesBySearch(queryToUse, targetPage);
                    break;
                case 'now_playing':
                    response = await getNowPlayingMovies(targetPage);
                    break;
                case 'top_rated':
                    response = await getTopRatedMovies(targetPage);
                    break;
                case 'upcoming':
                    response = await getUpcomingMovies(targetPage);
                    break;
                case 'popular':
                default:
                    response = await getPopularMovies(targetPage);
                    break;
            }

            set((s) => ({
                movies: append ? [...s.movies, ...(response.results || [])] : (response.results || []),
                currentPage: response.page,
                totalPages: response.total_pages,
                isLoading: false,
                isFetchingMore: false,
                currentCategory: activeCategory,
                // searchQuery: activeCategory === 'search' ? queryToUse : '',
            }));

        } catch (err: unknown) {
            console.error("Failed to fetch movies:", err);
            const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred.";
            set({ error: errorMessage, isLoading: false, isFetchingMore: false });
        }
    },

    loadMoreMovies: async () => {
        const state = get();
        if (state.currentPage < state.totalPages && !state.isLoading && !state.isFetchingMore) {
            state.fetchMovies(state.currentCategory, state.currentPage + 1, true);
        }
    },

    fetchSuggestions: async (query: string) => {
        if (query.length < 3) {
            set({ suggestions: [], isFetchingSuggestions: false });
            return;
        }
        set({ isFetchingSuggestions: true });
        try {
            const response: MovieListApiResponse = await getMoviesBySearch(query);
            set({ suggestions: response.results?.slice(0, 7) || [], isFetchingSuggestions: false });
        } catch (err: unknown) {
            console.error("Failed to fetch suggestions:", err);
            const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred.";
            set({ suggestions: [], isFetchingSuggestions: false });
        }
    },

    setCategory: (category: MovieCategory) => {
        set({ currentCategory: category, currentPage: 1, movies: [] })
        if (category !== 'search') {
            set({ searchQuery: '' });
        }
    },
}));