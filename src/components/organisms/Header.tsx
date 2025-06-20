"use client";

import React, { useState, useCallback, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Input } from '@/components/ui/input';

import { useMoviesStore } from "@/stores/movieStore"
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const router = useRouter();
    const menu = [
        {
            label: "Home",
            href: "",
        },
        {
            label: "Category",
            href: "/category",
        },
        {
            label: "Collection",
            href: "/collection",
        },
    ];
    const { searchQuery, setSearchQuery, fetchMovies } = useMoviesStore();
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            fetchMovies();
        }, 500);
    }, [setSearchQuery, fetchMovies]);

    const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        fetchMovies();
    }, [searchQuery, fetchMovies]);


    return (
        <header className="bg-white p-4 shadow-md fixed top-0 w-full z-10">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-3xl font-bold text-[#1E2F50]">Rolllt</ div>
                <div>
                    <ul className="flex gap-3">
                        {menu.map((item, index) =>
                            (<li key={index} className="cursor-pointer text-[#1E2F50]">{item.label}</li>)
                        )}
                    </ul>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative w-1/4 max-w-md">
                    <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                        <BiSearch className="h-4 w-4 text-[#1E2F50]" />
                    </div>
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search for movies..."
                        className="w-full rounded-lg bg-gray-100 pl-8 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#1E2F50]" // Warna abu-abu dan teks biru tua
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                </form>

            </nav>
        </header>
    );
};

export default Header;

