import api from "./api";
import apiUrls from "./apiConfig";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const getListMovie = async () => {
  const response = await api.get(`${apiUrls.discoverMovies}`);
  return response.data;
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

export const getMoviesBySearch = async (query: string) => {
  try {
    const response = await api.get(`${apiUrls.baseUrl}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};
