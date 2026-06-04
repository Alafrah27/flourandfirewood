"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, ChevronDown, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Navbar from "../../../components/navbar";
import MenuCard from "../../../components/MenuCard";
import { ProductGridSkeleton, CategorySkeleton } from "../../../components/MenuSkeleton";
import { useGetProducts } from "../../../services/productQuery";
import { useCategories } from "../../../services/categoryQuery";

function MenuContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = parseInt(searchParams.get("page")) || 1;
    const categoryFilter = searchParams.get("category") || "";
    const sortFilter = searchParams.get("sort") || "";
    const searchQueryURL = searchParams.get("search") || "";

    const [searchQuery, setSearchQuery] = useState(searchQueryURL);
    const [prevSearchQueryURL, setPrevSearchQueryURL] = useState(searchQueryURL);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = React.useRef(null);

    // Sync input field state with URL parameter changes
    if (searchQueryURL !== prevSearchQueryURL) {
        setSearchQuery(searchQueryURL);
        setPrevSearchQueryURL(searchQueryURL);
    }

    // Handle clicking outside the sort dropdown to close it
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    // Set page limit in URL on load if not present (defaulting to 9 for public grid)
    useEffect(() => {
        const currentLimit = searchParams.get("limit");
        if (currentLimit !== "9") {
            const current = new URLSearchParams(searchParams.toString());
            current.set("limit", "9");
            router.replace(`${pathname}?${current.toString()}`);
        }
    }, [searchParams, router, pathname]);

    const updateURL = (newParams) => {
        const current = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });
        current.set("limit", "9");
        router.push(`${pathname}?${current.toString()}`);
    };

    // Debounce search query update in URL
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== searchQueryURL) {
                updateURL({ search: searchQuery, page: 1 });
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, searchQueryURL]);

    const handleCategoryChange = (category) => {
        updateURL({ category, page: 1 });
    };

    const handleSortChange = (sort) => {
        updateURL({ sort, page: 1 });
    };

    const handlePageChange = (newPage) => {
        updateURL({ page: newPage });
    };

    // Fetch categories and products
    const { data: categories, isLoading: isCategoriesLoading } = useCategories();
    const { data, isLoading: isProductsLoading, error } = useGetProducts({
        page,
        limit: 9,
        category: categoryFilter,
        sort: sortFilter,
        search: searchQueryURL
    });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="w-full min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-12 flex-grow">
                {/* Header Title Section */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                    <span className="text-sm font-semibold tracking-widest text-[#41431B] uppercase">
                        Taste the smoky legacy
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        Discover Our Hearth Menu
                    </h1>
                    <div className="h-1 w-20 bg-[#41431B] mx-auto rounded-full" />
                </div>

                {/* Filters, Categories and Search Toolbar */}
                <div className="space-y-6 mb-12">
                    {/* Toolbar row with Search, Sort filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                        {/* Search Input */}
                        <div className="relative w-full md:w-96">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes, ingredients..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#41431B]/50 focus:ring-1 focus:ring-[#41431B]/20 transition-all font-light"
                            />
                        </div>

                        {/* Interactive sort selection */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            {/* Sorting Dropdown Selection */}
                            <div ref={sortDropdownRef} className="relative inline-block text-left">
                                <button
                                    type="button"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer min-w-[150px]"
                                >
                                    <span>
                                        {sortFilter === "" && "Sort: Latest"}
                                        {sortFilter === "asc" && "Name: A-Z"}
                                        {sortFilter === "desc" && "Name: Z-A"}
                                        {sortFilter === "highest" && "Price: High to Low"}
                                        {sortFilter === "lowest" && "Price: Low to High"}
                                    </span>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isSortOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                        {[
                                            { value: "", label: "Sort: Latest" },
                                            { value: "asc", label: "Name: A-Z" },
                                            { value: "desc", label: "Name: Z-A" },
                                            { value: "highest", label: "Price: High to Low" },
                                            { value: "lowest", label: "Price: Low to High" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    handleSortChange(option.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${sortFilter === option.value
                                                    ? "bg-[#41431B]/5 text-[#41431B]"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Horizontal scrolling Categories Bar */}
                    <div className="relative">
                        <div className="flex flex-row items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none w-full">
                            {/* "All" button */}
                            <button
                                onClick={() => handleCategoryChange("")}
                                className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer ${categoryFilter === ""
                                    ? "bg-[#41431B] text-white shadow-md shadow-[#41431B]/15"
                                    : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
                                    }`}
                            >
                                All Dishes
                            </button>

                            {/* Dynamic Category buttons / Skeleton Loader */}
                            {isCategoriesLoading ? (
                                <CategorySkeleton count={5} />
                            ) : (
                                categories?.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryChange(cat.categoryName)}
                                        className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer ${categoryFilter === cat.categoryName
                                            ? "bg-[#41431B] text-white shadow-md shadow-[#41431B]/15"
                                            : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
                                            }`}
                                    >
                                        {cat.categoryName}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Grid Section (Loading / Error / Results) */}
                {isProductsLoading && <ProductGridSkeleton count={6} />}

                {/* Error Display */}
                {error && (
                    <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 border border-rose-100 rounded-3xl text-center max-w-lg mx-auto">
                        <AlertTriangle className="text-rose-500 mb-4" size={40} />
                        <h3 className="text-lg font-bold text-slate-800">Failed to load the menu</h3>
                        <p className="text-sm text-slate-500 mt-2">
                            {error.message || "An unexpected error occurred while fetching the menu."}
                        </p>
                    </div>
                )}

                {/* Products grid */}
                {!isProductsLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <MenuCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isProductsLoading && !error && products.length === 0 && (
                    <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl max-w-lg mx-auto flex flex-col items-center justify-center p-8 shadow-sm">
                        <AlertTriangle className="text-[#41431B]/35 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-800">No dishes found</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs">
                            We couldn&apos;t find any items matching your selected criteria. Try resetting filters or changing search keywords.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                updateURL({ category: "", sort: "", search: "", page: 1 });
                            }}
                            className="mt-6 px-6 py-2.5 bg-[#41431B] hover:bg-[#515422] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* Pagination Controls */}
                {!isProductsLoading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-slate-100">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            <ArrowLeft size={14} />
                            Prev
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5">
                            {[...Array(totalPages)].map((_, idx) => {
                                const pageNum = idx + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${page === pageNum
                                            ? "bg-[#41431B] text-white shadow-md shadow-[#41431B]/15"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            Next
                            <ArrowRight size={14} />
                        </button>
                    </div>
                )}
            </main>

            {/* Custom hides for scrollbars on categories bar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="container mx-auto px-4 py-24 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-[#41431B] border-slate-100"></div>
                </main>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}