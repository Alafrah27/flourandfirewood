"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useGetCart } from "../services/cartQuery";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isSignedIn } = useAuth();
    const { data: cart } = useGetCart();

    const cartCount = isSignedIn && cart?.products
        ? cart.products.reduce((acc, item) => acc + item.quantity, 0)
        : 0;

    return (
        <header className="sticky top-0 left-0 w-full h-[65px] bg-slate-950/90 backdrop-blur-md border-b border-white/10 flex items-center z-50 transition-all duration-300">
            <nav className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between w-full">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <h4 className="text-xl font-bold text-white tracking-tight flex items-center">
                        F&<span className="text-[#A2A657] inline-block rotate-180 ml-0.5">F</span>
                    </h4>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-slate-300 hover:text-[#A2A657] font-medium text-sm tracking-tight transition-colors">Home</Link>
                    <Link href="/menu" className="text-slate-300 hover:text-[#A2A657] font-medium text-sm tracking-tight transition-colors">Menu</Link>
                    <Link href="/booking" className="text-slate-300 hover:text-[#A2A657] font-medium text-sm tracking-tight transition-colors">Booking</Link>
                    <Link href="/myorder" className="text-slate-300 hover:text-[#A2A657] font-medium text-sm tracking-tight transition-colors">My Order</Link>
                </div>

                {/* Right side controls (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    <Heart size={20} className="text-slate-300 cursor-pointer hover:text-[#A2A657] transition-colors" />
                    <Link href="/cart" className="relative">
                        <ShoppingCart size={20} className="text-slate-300 cursor-pointer hover:text-[#A2A657] transition-colors" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#41431B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
                    </Link>

                    <div className="h-4 w-px bg-white/15" />

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-5 py-2 rounded-xl text-sm font-semibold tracking-tight bg-[#41431B] hover:bg-[#515422] text-white cursor-pointer shadow-md shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02]">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="flex md:hidden items-center gap-4">
                    <Link href="/cart" className="relative mr-2">
                        <ShoppingCart size={20} className="text-slate-300 cursor-pointer hover:text-[#A2A657] transition-colors" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#41431B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-slate-300 hover:text-[#A2A657] focus:outline-none transition-colors cursor-pointer"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Dropdown */}
            <div className={`absolute top-[65px] left-0 w-full bg-slate-950 border-b border-white/10 md:hidden flex flex-col px-6 py-6 space-y-6 transition-all duration-300 ease-in-out z-40 transform ${mobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"}`}>
                <div className="flex flex-col space-y-4">
                    <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-slate-300 hover:text-[#A2A657] font-medium text-base transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/menu"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-slate-300 hover:text-[#A2A657] font-medium text-base transition-colors"
                    >
                        Menu
                    </Link>
                    <Link
                        href="/booking"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-slate-300 hover:text-[#A2A657] font-medium text-base transition-colors"
                    >
                        Booking
                    </Link>
                    <Link
                        href="/myorder"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-slate-300 hover:text-[#A2A657] font-medium text-base transition-colors"
                    >
                        My Order
                    </Link>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="text-slate-400 text-sm">Favorites</span>
                        <Heart size={20} className="text-slate-300 cursor-pointer hover:text-[#A2A657] transition-colors" />
                    </div>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#41431B] hover:bg-[#515422] text-white transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}