import { MovieListApiResponse } from "@/lib/types";
import api from "./api";
import apiUrls, { authToken } from "./apiConfig";
import { MovieDetailState } from "@/lib/interfaces";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const getPopularMovies = async (page: number = 1): Promise<MovieListApiResponse> => {
  try {
      const response = await api.get(`${apiUrls.baseUrl}/movie/popular`, {
          params: {
              api_key: TMDB_API_KEY,
              language: 'en-US',
              page: page,
          },
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
  }
};

export const getNowPlayingMovies = async (page: number = 1): Promise<MovieListApiResponse> => {
  try {
      const response = await api.get(`${apiUrls.baseUrl}/movie/now_playing`, {
          params: {
              api_key: TMDB_API_KEY,
              language: 'en-US',
              page: page,
          },
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching now playing movies:", error);
      throw error;
  }
};

export const getTopRatedMovies = async (page: number = 1): Promise<MovieListApiResponse> => {
  try {
      const response = await api.get(`${apiUrls.baseUrl}/movie/top_rated`, {
          params: {
              api_key: TMDB_API_KEY,
              language: 'en-US',
              page: page,
          },
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
  }
};

export const getUpcomingMovies = async (page: number = 1): Promise<MovieListApiResponse> => {
  try {
      const response = await api.get(`${apiUrls.baseUrl}/movie/upcoming`, {
          params: {
              api_key: TMDB_API_KEY,
              language: 'en-US',
              page: page,
          },
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
  }
};

export const getMoviesBySearch = async (query: string, page: number = 1): Promise<MovieListApiResponse> => {
  try {
      const response = await api.get(`${apiUrls.baseUrl}/search/movie`, {
          params: {
              api_key: TMDB_API_KEY,
              query: query,
              language: 'en-US',
              page: page,
              include_adult: false,
          },
           headers: {
              accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching search results:", error);
      throw error;
  }
};

export async function getImagesMovie(movie_id: string) {
  try {
    const response = await api.get(`${apiUrls.movie}/${movie_id}/image`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch movie list", error);
    throw error;
  }
}

export const getMovieDetail = async (movieId: string): Promise<MovieDetailState> => {
  try {
      const response = await api.get(`${apiUrls.baseUrl}/movie/${movieId}`, {
          params: {
              language: 'en-US',
          },
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
          }
      });
      return response.data;
  } catch (error) {
      console.error(`Error fetching movie detail for ID ${movieId}:`, error);
      throw error;
  }
};