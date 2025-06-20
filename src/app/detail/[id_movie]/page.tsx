"use client"

import { MovieDetailState } from '@/lib/interfaces';
import { getMovieDetail } from '@/services/movies.service';
import { useRouter } from 'next/navigation';
import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useEffect, useState } from 'react'; 

interface MovieDetailPageProps {
  params: {
    id_movie: string; 
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const router = useRouter();
  
  const unwrappedParams = React.use(params as any);
  const movieId = (unwrappedParams as any).id_movie;


  const [movieDetail, setMovieDetail] = useState<MovieDetailState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const detail = await getMovieDetail(movieId);
        setMovieDetail(detail);
      } catch (err: unknown) {
        console.error(`Failed to fetch movie detail for ID ${movieId}:`, err);
        setError(err instanceof Error ? err.message : "Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchDetail();
    }
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
        Loading movie details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-red-500 text-lg p-4 text-center">
        <p>Error: {error}</p>
        <p>Could not load movie details for ID: {movieId}</p>
      </div>
    );
  }

  if (!movieDetail) {
      return (
          <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
              Movie not found.
          </div>
      );
  }

  return (
    <div className="bg-[#E0E8F0] min-h-screen p-8 pt-20 text-[#1E2F50]">
      <div className='mb-4'>
        <FaArrowLeftLong className="h-8 w-12 text-[#1E2F50] cursor-pointer" onClick={() => router.back()}/>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        {movieDetail.poster_path && (
          <div className="md:flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movieDetail.poster_path}`}
              alt={movieDetail.title}
              className="w-full h-auto md:w-64 object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2">{movieDetail.title}</h1>
          {movieDetail.original_title !== movieDetail.title && (
            <p className="text-xl text-gray-600 mb-2">({movieDetail.original_title})</p>
          )}
          {movieDetail.tagline && (
            <p className="italic text-gray-700 mb-4">"{movieDetail.tagline}"</p>
          )}
          <p className="text-lg mb-2">
            Release Date: {new Date(movieDetail.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-lg mb-2">Rating: {movieDetail.vote_average?.toFixed(1)}/10 ({movieDetail.vote_count} votes)</p>
          {movieDetail.runtime && (
            <p className="text-lg mb-2">Runtime: {Math.floor(movieDetail.runtime / 60)}h {movieDetail.runtime % 60}m</p>
          )}
          {movieDetail.genres && movieDetail.genres.length > 0 && (
            <p className="text-lg mb-4">Genres: {movieDetail.genres.map(g => g.name).join(', ')}</p>
          )}
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-800 leading-relaxed">{movieDetail.overview}</p>
        </div>
      </div>
    </div>
  );
}