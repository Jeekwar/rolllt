const apiUrls = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    imageBaseUrl: process.env.NEXT_PUBLIC_BASE_IMAGE_URL,
    discoverMovies: "/discover/movie",
    movie: "/movie"
}

export const authToken = process.env.NEXT_PUBLIC_API_TOKEN


export default apiUrls