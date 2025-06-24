"use client";

import React, { useState, useCallback, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useMoviesStore } from "@/stores/movieStore";
import { MovieCategory } from '@/lib/types';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { searchQuery, setSearchQuery, fetchMovies, suggestions, fetchSuggestions, clearSuggestions, isFetchingSuggestions, setCategory, currentCategory } = useMoviesStore();

    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionDebounceRef = useRef<NodeJS.Timeout | null>(null);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showCategorySubmenu, setShowCategorySubmenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        const newCategory = query.length > 0 ? 'search' : currentCategory;
        setCategory(newCategory);

        searchDebounceRef.current = setTimeout(() => {
            fetchMovies(newCategory);
        }, 500);

        if (suggestionDebounceRef.current) {
            clearTimeout(suggestionDebounceRef.current);
        }

        if (query.length > 2) {
            suggestionDebounceRef.current = setTimeout(() => {
                fetchSuggestions(query);
                setShowSuggestions(true);
            }, 200);
        } else {
            clearSuggestions();
            setShowSuggestions(false);
        }
    }, [setSearchQuery, fetchMovies, fetchSuggestions, clearSuggestions, setCategory, currentCategory]);

    const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);

        setCategory('search');
        fetchMovies('search');
        clearSuggestions();
        setShowSuggestions(false);
        inputRef.current?.blur();

        if (pathname !== '/') {
            router.push('/');
        }
    }, [searchQuery, fetchMovies, clearSuggestions, pathname, router, setCategory]);

    const handleSuggestionClick = useCallback((title: string) => {
        setSearchQuery(title);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);

        setCategory('search');
        fetchMovies('search');
        clearSuggestions();
        setShowSuggestions(false);
        inputRef.current?.blur();

        if (pathname !== '/') {
            router.push('/');
        }
    }, [setSearchQuery, fetchMovies, clearSuggestions, pathname, router, setCategory]);

    const handleInputBlur = useCallback(() => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 150);
    }, []);

    const handleInputFocus = useCallback(() => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        } else if (searchQuery.length > 2) {
            fetchSuggestions(searchQuery);
            setShowSuggestions(true);
        }
    }, [suggestions.length, searchQuery, fetchSuggestions]);

    const menu = [
        { label: "Home", href: "/" },
        {
            label: "Category",
            href: "#",
            sub_menu: [
                { label: "Now Playing", category: "now_playing" as MovieCategory, href: "/" },
                { label: "Popular", category: "popular" as MovieCategory, href: "/" },
                { label: "Top Rated", category: "top_rated" as MovieCategory, href: "/" },
                { label: "Upcoming", category: "upcoming" as MovieCategory, href: "/" },
            ],
        },
        { label: "Collection", href: "/collection" },
    ];

    const handleCategorySubmenuClick = useCallback((category: Exclude<MovieCategory, 'search'>) => {
        setCategory(category);
        setSearchQuery('');
        fetchMovies(category);
        router.push('/');
        setShowCategorySubmenu(false);
    }, [setCategory, fetchMovies, router, setSearchQuery]);

    const handlerMenu = useCallback((item: { label: string, href: string, sub_menu?: any[] }) => {
        if (item.label === "Home") {
            router.push(item.href);
            setSearchQuery('');
            setCategory('popular');
        } else if (item.label === "Collection") {
            router.push(item.href);
            setSearchQuery('');
            setCategory('popular');
        }
    }, [router, setSearchQuery, setCategory]);

    return (
        <header className="bg-white p-4 shadow-md fixed top-0 w-full z-10">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-3xl font-bold text-[#1E2F50] cursor-pointer" onClick={() => { router.push('/'); setSearchQuery(''); setCategory('popular'); }}>Rolllt</div>
                <div>
                    <ul className="flex gap-3">
                        {menu.map((item, index) => (
                            <li
                                key={index}
                                className="relative cursor-pointer text-[#1E2F50] hover:text-blue-600"
                                onMouseEnter={() => item.label === "Category" && setShowCategorySubmenu(true)}
                                onMouseLeave={() => item.label === "Category" && setShowCategorySubmenu(false)}
                                onClick={() => handlerMenu(item)}
                            >
                                {item.label}
                                {item.sub_menu && showCategorySubmenu && (
                                    <ul className="absolute left-0 top-full w-40 bg-white border border-gray-200 rounded-md shadow-lg z-40">
                                        {item.sub_menu.map((subItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className="px-4 py-2 hover:bg-gray-100 text-sm text-[#1E2F50] cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCategorySubmenuClick(subItem.category);
                                                }}
                                            >
                                                {subItem.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
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
                        className="w-full rounded-lg bg-gray-100 pl-8 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#1E2F50] relative z-10"
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSuggestionClick(suggestion.title);
                                    }}
                                >
                                    {suggestion.poster_path ? (
                                        <Image
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