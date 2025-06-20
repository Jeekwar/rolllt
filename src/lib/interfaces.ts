import { MovieItem } from "./types";

export interface MovieState {

  movies: MovieItem[];
  defaultMovies: MovieItem[];
  isLoading: boolean; 
  isFetchingMore: boolean;
  error: string | null;
  searchQuery: string;
  suggestions: MovieItem[];
  isFetchingSuggestions: boolean;
  currentPage: number; 
  totalPages: number; 
  fetchMovies: () => Promise<void>; 
  fetchInitialDefaultMovies: () => Promise<void>; 
  fetchMoreDefaultMovies: () => Promise<void>; 
  setSearchQuery: (query: string) => void;
  fetchSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
  clearSearchResults: () => void; 
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface MovieDetailState{
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}