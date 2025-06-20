"use client"
import { motion } from "framer-motion"
import { useEffect} from "react"
import { getImagesMovie} from "@/services/movies.service"
import apiUrls from "@/services/apiConfig"
import { useMoviesStore } from "@/stores/movieStore"

const ListMovie: React.FC = (props) => {
    const movies = useMoviesStore((state) => state.movies);
    const isLoading = useMoviesStore((state) => state.isLoading);
    const error = useMoviesStore((state) => state.error);
    const fetchMovies = useMoviesStore((state) => state.fetchMovies);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies])


    const getItemImage = (id: string) => {
        getImagesMovie(id)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
                Loading movies...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-black text-red-500 text-lg p-4 text-center">
                <p>Error: {error}</p>
                <button
                    onClick={() => fetchMovies()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        );
    }


    return (
        <div className="bg-[#E0E8F0] h-auto" {...props} >
            <div className="grid grid-cols-2 md:grid-cols-5 justify-center pt-12 gap-x-5 gap-y-12 mt-12">
                {movies.map((item, index) => (

                    <div key={index} className="flex flex-col items-center transition-transform duration-300 hover:scale-110">
                        <div className="relative flex justify-center">
                            <img
                                src={`${apiUrls.imageBaseUrl}/w500/${item.poster_path}`}
                                alt={item.original_title}
                                className="w-[160px] h-[240px] rounded-md"
                            />
                            <div className="absolute bottom-2 bg-black/60 px-2 py-1 rounded flex flex-col gap-2">
                                <p className="text-white text-sm text-center">{item.original_title}</p>
                                <p className="text-white text-sm text-center">{`(${new Date(item.release_date).getFullYear()})`}</p>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default ListMovie
