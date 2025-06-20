"use client";

import React, { useState, useCallback, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Input } from '@/components/ui/input';

import { useMoviesStore } from "@/stores/movieStore";
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const { searchQuery, setSearchQuery, fetchMovies, suggestions, fetchSuggestions, clearSuggestions, isFetchingSuggestions } = useMoviesStore();
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionDebounceRef = useRef<NodeJS.Timeout | null>(null);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Clear debounce untuk pencarian utama
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        // Set debounce untuk pencarian utama (misal, setelah 500ms tidak mengetik)
        searchDebounceRef.current = setTimeout(() => {
            if (query === "") {
                fetchMovies();
            }

        }, 500);

        if (suggestionDebounceRef.current) {
            clearTimeout(suggestionDebounceRef.current);
        }

        if (query.length > 2) {
            suggestionDebounceRef.current = setTimeout(() => {
                fetchSuggestions(query);
                setShowSuggestions(true); // Tampilkan saran setelah fetch
            }, 200);
        } else {
            clearSuggestions(); // Hapus saran jika query terlalu pendek atau kosong
            setShowSuggestions(false);
        }
    }, [setSearchQuery, fetchMovies, fetchSuggestions, clearSuggestions]);

    const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Clear semua debounce saat submit
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);

        fetchMovies(); // Panggil fetchMovies segera
        clearSuggestions(); // Hapus saran setelah submit
        setShowSuggestions(false); // Sembunyikan saran
        inputRef.current?.blur(); // Sembunyikan keyboard di mobile
       
    }, [searchQuery, fetchMovies, clearSuggestions]);

    // Menangani klik pada saran
    const handleSuggestionClick = useCallback((title: string) => {
        setSearchQuery(title); // Isi input dengan saran yang diklik
        // Clear semua debounce saat memilih saran
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);

        fetchMovies(); // Langsung lakukan pencarian dengan saran tersebut
        clearSuggestions(); // Hapus saran
        setShowSuggestions(false); // Sembunyikan saran
        inputRef.current?.blur(); // Sembunyikan keyboard di mobile
       ;
    }, [setSearchQuery, fetchMovies, clearSuggestions]);

    // Menangani ketika input kehilangan fokus (blur)
    const handleInputBlur = useCallback(() => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 150); // Delay sedikit untuk memungkinkan klik pada saran
    }, []);

    // Menangani ketika input mendapatkan fokus (focus)
    const handleInputFocus = useCallback(() => {
        if (suggestions.length > 0) {
            setShowSuggestions(true); // Tampilkan saran lagi jika ada
        }
    }, [suggestions.length]);


    const menu = [
        { label: "Home", href: "" },
        { label: "Category", href: "/category" },
        { label: "Collection", href: "/collection" },
    ];

    return (
        <header className="bg-white p-4 shadow-md fixed top-0 w-full z-10">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-3xl font-bold text-[#1E2F50]">Rolllt</div>
                <div>
                    <ul className="flex gap-3">
                        {menu.map((item, index) =>
                            (<li key={index} className="cursor-pointer text-[#1E2F50] hover:text-blue-600">{item.label}</li>)
                        )}
                    </ul>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative w-1/4 max-w-md">
                    <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-20"> 
                        <BiSearch className="h-4 w-4 text-[#1E2F50]" />
                    </div>
                    <Input
                        ref={inputRef} 
                        id="search"
                        type="search"
                        placeholder="Search for movies..."
                        className="w-full rounded-lg bg-gray-100 pl-8 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#1E2F50] relative z-10" // z-index untuk memastikan input di atas saran
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    />

                    {showSuggestions && searchQuery.length > 0 && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-30 max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                    onClick={() => handleSuggestionClick(suggestion.title)}
                                >
                                    {suggestion.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92/${suggestion.poster_path}`}
                                            alt={suggestion.title}
                                            className="w-8 h-12 object-cover rounded-sm"
                                        />
                                    ) : (
                                        <div className="w-8 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-sm">No Img</div>
                                    )}
                                    <span className="text-[#1E2F50] text-sm">{suggestion.title}</span>
                                    {suggestion.release_date && (
                                        <span className="text-gray-500 text-xs ml-auto">
                                            ({new Date(suggestion.release_date).getFullYear()}) 
                                        </span>
                                    )}
                                </div>
                            ))}
                            {isFetchingSuggestions && (
                                <div className="p-3 text-center text-gray-500 text-sm">Loading suggestions...</div>
                            )}
                        </div>
                    )}
                    {showSuggestions && searchQuery.length > 0 && !isFetchingSuggestions && suggestions.length === 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-30 p-3 text-center text-gray-500 text-sm">
                            No suggestions found.
                        </div>
                    )}
                </form>

            </nav>
        </header>
    );
};

export default Header;