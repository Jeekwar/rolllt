"use client";
import React, { useEffect } from "react";
import { useMoviesStore } from "@/stores/movieStore";
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from "next/link";
import { MovieItem } from "@/lib/types";
import Image from "next/image";
const ListMovie: React.FC = (props) => {
    const movies = useMoviesStore((state) => state.movies);
    const isLoading = useMoviesStore((state) => state.isLoading);
    const isFetchingMore = useMoviesStore((state) => state.isFetchingMore);
    const error = useMoviesStore((state) => state.error);
    const currentPage = useMoviesStore((state) => state.currentPage);
    const totalPages = useMoviesStore((state) => state.totalPages);
    const searchQuery = useMoviesStore((state) => state.searchQuery);
    const currentCategory = useMoviesStore((state) => state.currentCategory);
    const fetchMovies = useMoviesStore((state) => state.fetchMovies);
    const loadMoreMovies = useMoviesStore((state) => state.loadMoreMovies);

    const displayData = movies;
    const hasMore = currentPage < totalPages;

    useEffect(() => {
        if (displayData.length === 0 && !isLoading && !isFetchingMore) {
            fetchMovies(currentCategory, 1);
        }
    }, [fetchMovies, currentCategory, searchQuery, displayData.length, isLoading, isFetchingMore]);


    if (isLoading && displayData.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#E0E8F0] text-[#1E2F50] text-lg">
                Loading movies...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#E0E8F0] text-red-500 text-lg p-4 text-center">
                <p>Error: {error}</p>
                <button
                    onClick={() => {
                        fetchMovies(currentCategory, 1);
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (displayData.length === 0 && !isLoading && !isFetchingMore) {
        return (
            <div className="bg-[#E0E8F0] min-h-screen flex justify-center items-center">
                <p className="text-gray-700 text-xl">
                    {searchQuery
                        ? `No results found for "${searchQuery}".`
                        : `No movies available for "${currentCategory.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}".`}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#E0E8F0] min-h-screen pt-16" {...props} >
            <InfiniteScroll
                dataLength={displayData.length}
                next={loadMoreMovies}
                hasMore={hasMore}
                loader={
                    <div className="flex justify-center items-center py-4 text-[#1E2F50]">
                        <h4>{isFetchingMore ? 'Loading more movies...' : 'Loading...'}</h4>
                    </div>
                }
                endMessage={
                    !hasMore && displayData.length > 0 && (
                        <p style={{ textAlign: 'center', margin: '20px' }}>
                            <b>Yay! You have seen it all.</b>
                        </p>
                    )
                }
            >
                <div className="grid grid-cols-2 md:grid-cols-5 justify-center pt-12 gap-x-5 gap-y-12">
                    {displayData.map((item: MovieItem, index) => (
                        <div key={index} className="flex flex-col items-center transition-transform duration-300 hover:scale-110 group cursor-pointer">
                            <Link
                                href={`/detail/${item.id}`}
                                className="flex flex-col items-center transition-transform duration-300 hover:scale-110 group cursor-pointer"
                            >
                                <div className="relative flex justify-center">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                                        alt={item.original_title}
                                        className="w-[160px] h-[240px] rounded-md shadow-md"
                                    />
                                    <div className="absolute bottom-2 bg-black/60 px-2 py-1 rounded flex flex-col gap-1 ">
                                        <p className="text-white text-sm text-center">{item.original_title}</p>
                                        {item.release_date && (
                                            <p className="text-gray-300 text-xs text-center">{`(${new Date(item.release_date).getFullYear()})`}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ListMovie;