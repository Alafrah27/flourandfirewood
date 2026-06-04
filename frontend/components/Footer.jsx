import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

// Custom inline SVG icons since brand icons are not exported in this version of lucide-react
const Instagram = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const Twitter = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

const Facebook = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const Youtube = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
        <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-white/10 pt-16 pb-8 w-full font-sans">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
                
                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* Column 1: Branding & Description */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-xl font-bold text-white tracking-tight flex items-center">
                            F&<span className="text-[#A2A657] inline-block rotate-180 ml-0.5">F</span>
                            <span className="text-xs font-light text-slate-500 ml-2 tracking-wide uppercase">flour&firewood</span>
                        </h4>
                        <p className="text-sm font-light leading-relaxed text-slate-400">
                            We honor the ancient craft of artisanal wood-fired baking. Taste the rich, smoky legacy in our natural sourdough pizzas, slow-proved hearth breads, and fire-kissed gourmet plates in Riyadh.
                        </p>
                        {/* Social Media icons */}
                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#A2A657] hover:bg-[#A2A657]/10 hover:border-[#A2A657]/20 transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="Instagram"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#A2A657] hover:bg-[#A2A657]/10 hover:border-[#A2A657]/20 transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="Twitter/X"
                            >
                                <Twitter size={16} />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#A2A657] hover:bg-[#A2A657]/10 hover:border-[#A2A657]/20 transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="Facebook"
                            >
                                <Facebook size={16} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#A2A657] hover:bg-[#A2A657]/10 hover:border-[#A2A657]/20 transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="YouTube"
                            >
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Explore Links */}
                    <div className="lg:col-span-2 lg:col-start-6 space-y-4">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h5>
                        <ul className="space-y-3 text-sm font-light">
                            <li>
                                <Link href="/" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                                    Menu Catalog
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                                    Book a Table
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                                    My Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact details */}
                    <div className="lg:col-span-3 space-y-4">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Visit Us</h5>
                        <ul className="space-y-3.5 text-sm font-light">
                            <li className="flex items-start gap-2.5 leading-relaxed">
                                <MapPin size={16} className="text-[#A2A657] mt-0.5 flex-shrink-0" />
                                <span>Riyadh, Kingdom of Saudi Arabia</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone size={16} className="text-[#A2A657] flex-shrink-0" />
                                <a href="tel:+966500000000" className="hover:text-white transition-colors">
                                    +966 50 000 0000
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail size={16} className="text-[#A2A657] flex-shrink-0" />
                                <a href="mailto:hello@flourandfirewood.com" className="hover:text-white transition-colors break-all">
                                    hello@flourandfirewood.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Operating Hours */}
                    <div className="lg:col-span-2 space-y-4">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Hearth Hours</h5>
                        <ul className="space-y-3.5 text-sm font-light">
                            <li className="flex items-start gap-2.5">
                                <Clock size={16} className="text-[#A2A657] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-white">Daily</p>
                                    <p className="text-xs text-slate-400 mt-1">8:00 am - 11:50 pm</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 italic">Kitchen closes at 11:30 pm</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Copyright and minor policy terms */}
                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-slate-500">
                    <p>© 2026 flour&firewood. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
