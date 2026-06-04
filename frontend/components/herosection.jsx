"use client";

import Image from "next/image";
import { Utensils, Calendar, Star, Clock, Flame } from "lucide-react";
export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[calc(100vh-65px)] bg-slate-950 overflow-hidden flex items-center py-12 md:py-20 lg:py-24">
            {/* Background elements & soft ambient glows */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-transparent z-10" />
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#8d705d]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#41431B]/5 rounded-full blur-3xl" />

            {/* Background Image of the brick oven */}
            <Image
                src="/hero_food.png"
                alt="Flour and Firewood rustic brick oven and fresh artisan dishes"
                fill
                className="absolute inset-0 object-cover object-center z-0 scale-105 animate-[pulse_6s_infinite_alternate] opacity-60"
                priority
            />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column - Headline & Main CTA */}
                    <div className="lg:col-span-7 text-left space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-[#D9C4A0] rounded-full text-xs font-semibold uppercase tracking-wider animate-bounce-subtle">
                            <Flame size={14} className="animate-pulse" />
                            Riyadh&apos;s Premier Hearth Experience
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                            Crafted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E924C] to-[#41431B]">Flame</span>,<br />
                            Perfected by Time.
                        </h1>

                        <p className="text-lg text-slate-300 max-w-xl font-light leading-relaxed">
                            Welcome to <span className="font-semibold text-white">Flour & Firewood</span>.
                            We honor the ancient craft of artisanal wood-fired baking. Taste the rich, smoky legacy in our natural sourdough pizzas, slow-proved hearth breads, and fire-kissed gourmet plates.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <a
                                href="#menu"
                                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5A5E26] to-[#41431B] text-white font-semibold rounded-xl shadow-lg shadow-[#41431B]/25 hover:shadow-[#41431B]/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                            >
                                <Utensils size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                                Order Online
                            </a>
                            <a
                                href="#booking"
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                            >
                                <Calendar size={20} />
                                Book a Table
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                ))}
                                <span className="text-white font-bold ml-1 text-sm">4.9/5</span>
                                <span className="text-slate-400 text-xs ml-1">(1,200+ Reviews)</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <Clock size={16} className="text-[#41431B]" />
                                <span>Open daily: 8:00 am - 11:50 pm</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Premium floating cards and mini interactive element */}
                    <div className="lg:col-span-5 hidden lg:block relative">
                        {/* Floating Signature Dish Card */}
                        <div className="absolute -top-12 -left-12 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xs animate-float z-20">
                            <div className="w-14 h-14 relative rounded-xl overflow-hidden flex-shrink-0 bg-zinc-850">
                                <Image
                                    src="/hero_food.png"
                                    alt="Truffle flatbread"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Wood-Fired Truffle Sourdough</h4>
                                <p className="text-amber-400 text-xs font-semibold mt-0.5">Riyadh&apos;s Choice</p>
                            </div>
                        </div>

                        {/* Booking urgent preview card */}
                        <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 border border-white/10 p-6 rounded-3xl shadow-2xl space-y-4 max-w-sm ml-auto relative z-10 backdrop-blur-lg">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <span className="text-white font-bold text-lg">Table Reservations</span>
                                <span className="px-2.5 py-0.5 bg-green-500/15 text-green-400 rounded-full text-xs font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                                    Active Now
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-slate-400 text-xs">Reservations Tonight</p>
                                    <p className="text-white font-semibold text-sm mt-1">94% Booked Out</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs">Next Available Table</p>
                                        <p className="text-white font-semibold text-sm mt-1">Today at 7:30 PM</p>
                                    </div>
                                    <a
                                        href="#booking"
                                        className="px-3 py-1.5 bg-[#41431B] hover:bg-[#515422] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                    >
                                        Reserve
                                    </a>
                                </div>
                            </div>

                            <div className="pt-2 text-center">
                                <p className="text-slate-400 text-xs">No booking fee • Free cancellation up to 2 hours before</p>
                            </div>
                        </div>

                        {/* Soft ambient decorative ring */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[#41431B]/20 rounded-full z-0" />
                    </div>

                </div>
            </div>

            {/* Custom float animation styles injected safely */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}} />
        </section>
    );
}