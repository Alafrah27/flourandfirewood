"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { useGetProducts } from '../services/productQuery';
import MenuCard from './MenuCard';
import { ProductGridSkeleton } from './MenuSkeleton';

export default function RandomMenu() {
    // Fetch 6 random products
    const { data, isLoading, error } = useGetProducts({
        limit: 6,
        random: "true"
    });

    const products = data?.products || [];

    return (
        <section className="py-20 bg-background w-full">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <span className="text-sm font-semibold tracking-widest text-[#41431B] uppercase">
                        Our Recommendations
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        Today&apos;s Special Hearth Menu
                    </h2>
                    <div className="h-1 w-20 bg-[#41431B] mx-auto rounded-full" />
                    <p className="text-slate-500 font-light text-base md:text-lg">
                        Explore our handcrafted, flourandfirewood selection proofed to perfection and prepared fresh daily.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && <ProductGridSkeleton count={6} />}

                {/* Error State */}
                {error && (
                    <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 border border-rose-100 rounded-3xl text-center max-w-lg mx-auto">
                        <AlertTriangle className="text-rose-500 mb-4" size={40} />
                        <h3 className="text-lg font-bold text-slate-800">Failed to load the menu</h3>
                        <p className="text-sm text-slate-500 mt-2">
                            {error.message || "An unexpected error occurred while fetching the menu."}
                        </p>
                    </div>
                )}

                {/* Menu List */}
                {!isLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {products.map((product) => (
                            <MenuCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && products.length === 0 && (
                    <div className="text-center py-16 text-slate-500 border border-slate-200 border-dashed rounded-3xl max-w-lg mx-auto bg-white">
                        <p className="font-semibold text-slate-700">No dishes on the menu today</p>
                        <p className="text-sm mt-1">Please check back later or browse other sections.</p>
                    </div>
                )}

                {/* CTA "See More" Button */}
                <div className="flex justify-center mt-16">
                    <Link
                        href="/menu"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-lg shadow-[#41431B]/15 hover:shadow-[#41431B]/25 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-base tracking-tight"
                    >
                        See More Dishes
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
