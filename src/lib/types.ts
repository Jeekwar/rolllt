export type MovieItem = {
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

export type MovieListApiResponse = {
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
};

export type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'upcoming' | 'search';
