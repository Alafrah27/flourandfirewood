"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, ChevronRight } from 'lucide-react';

export default function BookingSection() {
    return (
        <section id="booking" className="w-full bg-[#12130c]/90 text-white py-16 md:py-24 border-t border-white/5 relative overflow-hidden flex items-center justify-center font-sans">
            {/* Background design elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,166,87,0.04)_0%,transparent_75%)] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#41431B]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Text & CTA */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                        {/* Decorative Icon */}
                        <div className="w-12 h-12 bg-[#A2A657]/10 border border-[#A2A657]/20 text-[#A2A657] rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
                            <CalendarDays size={20} />
                        </div>

                        {/* Emotional Taglines & Text */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold tracking-widest text-[#A2A657] uppercase bg-[#A2A657]/10 px-3.5 py-1.5 rounded-full inline-block">
                                Create Beautiful Memories
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                Gather Around the Hearth
                            </h2>
                            <p className="text-slate-300 font-light text-sm md:text-base leading-relaxed">
                                Every meal is a story waiting to be shared. Feel the warmth of our glowing wood-fired brick oven, hear the crackle of the firewood, and craft beautiful memories with the ones you love. We proof the dough; you share the laughter.
                            </p>
                        </div>

                        {/* Reservation Action Button */}
                        <div className="pt-2">
                            <Link
                                href="/booking"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A2A657] hover:bg-[#b2b667] text-slate-950 font-bold rounded-2xl shadow-lg shadow-[#A2A657]/10 hover:shadow-[#A2A657]/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-xs uppercase tracking-wider"
                            >
                                Book a Table Now
                                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Beautiful Image Card */}
                    <div className="lg:col-span-6">
                        <div className="relative h-[280px] sm:h-[380px] md:h-[440px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 group">
                            <Image
                                src="/booking_banner.png"
                                alt="flour&firewood dining table"
                                fill
                                className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                                sizes="(max-w-1024px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}