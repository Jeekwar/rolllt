import { useMoviesStore } from '../../stores/movieStore';
import * as movieService from '@/services/movies.service';
import { act } from 'react';

jest.mock('@/services/movies.service');

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Overview',
  poster_path: '/poster.jpg',
};

const mockResponse = {
  page: 1,
  total_pages: 2,
  results: [mockMovie],
};

describe('useMoviesStore', () => {
  beforeEach(() => {
    useMoviesStore.setState(useMoviesStore.getInitialState()); 
    jest.clearAllMocks();
  });

  it('sets search query correctly', () => {
    useMoviesStore.getState().setSearchQuery('Batman');
    expect(useMoviesStore.getState().searchQuery).toBe('Batman');
  });

  it('clears suggestions', () => {
    useMoviesStore.setState({ suggestions: [mockMovie] });
    useMoviesStore.getState().clearSuggestions();
    expect(useMoviesStore.getState().suggestions).toEqual([]);
  });

  it('clears search results and resets state', async () => {
    const getPopularMoviesMock = movieService.getPopularMovies as jest.Mock;
    getPopularMoviesMock.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useMoviesStore.getState().clearSearchResults();
    });

    const state = useMoviesStore.getState();
    expect(state.searchQuery).toBe('');
    expect(state.currentPage).toBe(1);
    expect(state.currentCategory).toBe('popular');
    expect(state.movies).toEqual(mockResponse.results);
  });

  it('fetches popular movies (initial)', async () => {
    const getPopularMoviesMock = movieService.getPopularMovies as jest.Mock;
    getPopularMoviesMock.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useMoviesStore.getState().fetchMovies('popular', 1);
    });

    const state = useMoviesStore.getState();
    expect(state.movies).toEqual([mockMovie]);
    expect(state.currentPage).toBe(1);
    expect(state.totalPages).toBe(2);
    expect(state.isLoading).toBe(false);
  });

  it('appends movies when loading more', async () => {
    const getPopularMoviesMock = movieService.getPopularMovies as jest.Mock;
    getPopularMoviesMock.mockResolvedValue(mockResponse);

    // Load first page
    await act(async () => {
      await useMoviesStore.getState().fetchMovies('popular', 1);
    });

    // Load more (append)
    const secondMovie = { ...mockMovie, id: 2 };
    getPopularMoviesMock.mockResolvedValueOnce({
      ...mockResponse,
      page: 2,
      results: [secondMovie],
    });

    await act(async () => {
      await useMoviesStore.getState().fetchMovies('popular', 2, true);
    });

    const state = useMoviesStore.getState();
    expect(state.movies).toHaveLength(2);
    expect(state.movies[1]).toEqual(secondMovie);
    expect(state.currentPage).toBe(2);
  });

  it('fetches suggestions for search', async () => {
    const getMoviesBySearchMock = movieService.getMoviesBySearch as jest.Mock;
    getMoviesBySearchMock.mockResolvedValueOnce({
      results: Array(10).fill(mockMovie),
    });

    await act(async () => {
      await useMoviesStore.getState().fetchSuggestions('bat');
    });

    const state = useMoviesStore.getState();
    expect(state.suggestions).toHaveLength(7);
  });

  it('does not fetch suggestions for short queries', async () => {
    await act(async () => {
      await useMoviesStore.getState().fetchSuggestions('ba');
    });

    const state = useMoviesStore.getState();
    expect(state.suggestions).toEqual([]);
  });

  it('sets category and resets movie list', () => {
    useMoviesStore.getState().setCategory('now_playing');
    const state = useMoviesStore.getState();

    expect(state.currentCategory).toBe('now_playing');
    expect(state.movies).toEqual([]);
    expect(state.searchQuery).toBe('');
    expect(state.currentPage).toBe(1);
  });
});
