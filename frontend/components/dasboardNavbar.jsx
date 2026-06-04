"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function DasboardNavbar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQueryURL = searchParams.get("search") || "";
    const [searchVal, setSearchVal] = useState(searchQueryURL);

    // Sync local state when the URL parameter changes externally
    useEffect(() => {
        setSearchVal(searchQueryURL);
    }, [searchQueryURL]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchVal(value);

        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        // Reset page pagination index to page 1 on search change
        params.set("page", "1");

        // Determine destination path: if on a non-searchable route, route to /orders
        let targetPath = pathname;
        if (
            pathname === "/dashboard" || 
            pathname === "/settings" || 
            pathname === "/categories"
        ) {
            targetPath = "/orders";
        }

        router.push(`${targetPath}?${params.toString()}`);
    };

    return (
        <div className="sticky top-0 left-0 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md py-4 px-6 z-30">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="relative max-w-md w-full hidden sm:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchVal}
                        onChange={handleSearchChange}
                        placeholder="Search orders, menu, customers, tables..."
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#41431B]/50 focus:ring-1 focus:ring-[#41431B]/20 transition-all"
                    />
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-4 ml-auto">
                    <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#41431B] rounded-full" />
                    </button>
                    <div className="h-5 w-px bg-white/10" />
                    <UserButton />
                </div>
            </div>
        </div>
    );
}

export default DasboardNavbar;