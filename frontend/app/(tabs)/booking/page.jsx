"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Info, MapPin, Phone, Mail, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Navbar from '../../../components/navbar';

export default function BookingPage() {
    // Form states
    const [guests, setGuests] = useState(2);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('7:00 PM');
    const [zone, setZone] = useState('main'); // main, terrace, hearth
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // Flow states
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingCode, setBookingCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Min date restriction (today)
    const [minDate, setMinDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
        setDate(`${yyyy}-${mm}-${dd}`); // Default to today
    }, []);

    const guestPills = [1, 2, 3, 4, 5, 6, 8, 10];
    const lunchSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'];
    const dinnerSlots = ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM'];

    const zones = [
        { id: 'main', name: 'Main Dining Room', desc: 'Warm ambient tables near live acoustics.', capacity: '1-10 guests' },
        { id: 'terrace', name: 'Open Air Terrace', desc: 'Dining under the Riyadh night sky.', capacity: '1-6 guests' },
        { id: 'hearth', name: 'Chef\'s Hearth Counter', desc: 'Front-row bar stools facing the brick oven.', capacity: '1-2 guests' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name || !email || !phone || !date || !time) {
            setErrorMsg('Please complete all contact and reservation details.');
            return;
        }

        setIsLoading(true);

        // Simulate booking API execution
        setTimeout(() => {
            setIsLoading(false);
            setIsConfirmed(true);
            // Generate a random confirmation key
            const randCode = 'FF-' + Math.floor(1000 + Math.random() * 9000);
            setBookingCode(randCode);
        }, 1500);
    };

    const handleReset = () => {
        setGuests(2);
        setTime('7:00 PM');
        setZone('main');
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
        setIsConfirmed(false);
        setBookingCode('');
        setErrorMsg('');
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-12 max-w-6xl flex flex-col justify-center">
                
                {/* Hero Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-bold tracking-widest text-[#A2A657] uppercase bg-[#A2A657]/10 px-4 py-1.5 rounded-full inline-block">
                        Table Reservation
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
                        Reserve Your Table
                    </h1>
                    <p className="text-slate-400 font-light text-sm md:text-base mt-3 leading-relaxed">
                        Join us at flour&firewood in Riyadh. Experience natural sourdough pizzas, hearth breads, and fire-cooked gourmet plates.
                    </p>
                </div>

                {/* Main View Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left: Info Card */}
                    <div className="lg:col-span-4 bg-slate-900/60 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#A2A657]/5 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    The Hearth Experience
                                </h3>
                                <p className="text-slate-400 text-xs mt-2 leading-relaxed font-light">
                                    Weproof our dough over 48 hours and roast fresh plates in wood-fired ovens. Slots fill up quickly, especially on weekends.
                                </p>
                            </div>

                            {/* Terms / Info pills */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[#A2A657] shrink-0">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Confirmation</h4>
                                        <p className="text-[11px] text-slate-400 font-light mt-0.5">Booking confirmation receipt sent to email immediately.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[#A2A657] shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cancellation Policy</h4>
                                        <p className="text-[11px] text-slate-400 font-light mt-0.5">Cancel or modify slot free of charge up to 2 hours before.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[#A2A657] shrink-0">
                                        <Info size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Group Bookings</h4>
                                        <p className="text-[11px] text-slate-400 font-light mt-0.5">For parties larger than 10, please call our Riyadh line directly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact details */}
                        <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-xs font-light text-slate-400 relative z-10">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-[#A2A657]" />
                                <span>Riyadh, KSA</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-[#A2A657]" />
                                <a href="tel:+966500000000" className="hover:text-white transition-colors">+966 50 000 0000</a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Form Panel */}
                    <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-center min-h-[500px]">
                        
                        {/* STATE 1: LOADING */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <div className="w-12 h-12 border-4 border-[#A2A657] border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm font-medium text-slate-400">Verifying hearth availability...</p>
                            </div>
                        )}

                        {/* STATE 2: CONFIRMED RESERVATION */}
                        {!isLoading && isConfirmed && (
                            <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 bg-[#A2A657]/10 border border-[#A2A657]/20 text-[#A2A657] rounded-full flex items-center justify-center shadow-lg shadow-black/30">
                                    <CheckCircle2 size={32} />
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs font-extrabold text-[#A2A657] uppercase tracking-widest bg-[#A2A657]/10 px-4 py-1.5 rounded-full">
                                        Reservation Confirmed
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
                                        We\'ve Got Your Table!
                                    </h2>
                                    <p className="text-slate-400 font-light text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                                        Thank you, <span className="font-bold text-white">{name}</span>. A receipt has been sent to <span className="font-bold text-[#A2A657]">{email}</span>.
                                    </p>
                                </div>

                                {/* Custom Receipt Ticket */}
                                <div className="w-full max-w-md bg-slate-950 border border-white/5 rounded-2xl relative overflow-hidden shadow-inner">
                                    {/* Ticket side punches */}
                                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-900 rounded-full border border-white/5 z-20 -translate-y-1/2" />
                                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-900 rounded-full border border-white/5 z-20 -translate-y-1/2" />
                                    
                                    <div className="p-6 text-left space-y-4">
                                        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                            <span className="text-slate-500 uppercase tracking-wider font-semibold">Receipt Code</span>
                                            <span className="font-mono font-bold text-[#A2A657] text-sm">{bookingCode}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs font-light">
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Date & Time</span>
                                                <span className="text-white font-medium">{date} @ {time}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Table Size</span>
                                                <span className="text-white font-medium">{guests} Guests</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Seating Area</span>
                                                <span className="text-white font-medium capitalize">{zone} Zone</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Contact</span>
                                                <span className="text-white font-medium">{phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold rounded-xl text-xs transition-all duration-300 cursor-pointer"
                                    >
                                        Book Another Table
                                    </button>
                                    <Link
                                        href="/"
                                        className="px-6 py-3 bg-[#A2A657] hover:bg-[#b2b667] text-slate-950 font-bold rounded-xl text-xs transition-all duration-300 inline-flex items-center gap-1.5"
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* STATE 3: FORM */}
                        {!isLoading && !isConfirmed && (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                
                                {/* Guest Selector */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Users size={14} className="text-[#A2A657]" />
                                        Number of Guests
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {guestPills.map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setGuests(num)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                                                    guests === num
                                                        ? 'bg-[#A2A657] text-slate-950 border-[#A2A657] font-bold shadow-md shadow-[#A2A657]/10'
                                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/25'
                                                }`}
                                            >
                                                {num} {num === 1 ? 'Guest' : 'Guests'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date & Zone Selection Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Date input */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <Calendar size={14} className="text-[#A2A657]" />
                                            Choose Date
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            min={minDate}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A2A657]/50 focus:ring-1 focus:ring-[#A2A657]/20 transition-all cursor-pointer font-light"
                                        />
                                    </div>

                                    {/* Seating preference list */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <MapPin size={14} className="text-[#A2A657]" />
                                            Seating Zone
                                        </label>
                                        <select
                                            value={zone}
                                            onChange={(e) => setZone(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#A2A657]/50 focus:ring-1 focus:ring-[#A2A657]/20 transition-all cursor-pointer font-light"
                                        >
                                            {zones.map((z) => (
                                                <option key={z.id} value={z.id} className="bg-slate-900 text-white">
                                                    {z.name} ({z.capacity})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Time Slot Selectors */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Clock size={14} className="text-[#A2A657]" />
                                        Select Time Slot
                                    </label>
                                    
                                    <div className="space-y-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                                        {/* Lunch section */}
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lunch</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {lunchSlots.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setTime(slot)}
                                                        className={`px-3.5 py-2 rounded-lg text-xs font-light transition-all duration-200 cursor-pointer border ${
                                                            time === slot
                                                                ? 'bg-[#A2A657] text-slate-950 border-[#A2A657] font-semibold'
                                                                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dinner section */}
                                        <div className="pt-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dinner</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {dinnerSlots.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setTime(slot)}
                                                        className={`px-3.5 py-2 rounded-lg text-xs font-light transition-all duration-200 cursor-pointer border ${
                                                            time === slot
                                                                ? 'bg-[#A2A657] text-slate-950 border-[#A2A657] font-semibold'
                                                                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Coordinates */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                        Personal Contact Details
                                    </span>
                                    
                                    {errorMsg && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                                            <Info size={14} />
                                            <span>{errorMsg}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Full Name *"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A2A657]/50 focus:ring-1 focus:ring-[#A2A657]/20 transition-all font-light"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email Address *"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A2A657]/50 focus:ring-1 focus:ring-[#A2A657]/20 transition-all font-light"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Phone Number *"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A2A657]/50 focus:ring-1 focus:ring-[#A2A657]/20 transition-all font-light"
                                            />
                                        </div>
                                    </div>

                                    {/* Optional special notes */}
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Special requests, dietary specs or occasion details (optional)..."
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A2A657]/50 focus:ring-1 focus:ring-[#A2A657]/20 transition-all font-light resize-none"
                                    />
                                </div>

                                {/* Form Submit Action */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#A2A657] hover:bg-[#b2b667] text-slate-950 font-bold rounded-2xl shadow-lg shadow-[#A2A657]/10 hover:shadow-[#A2A657]/20 transition-all duration-300 hover:scale-[1.005] cursor-pointer text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    Book Hearth Reservation
                                    <ChevronRight size={16} />
                                </button>
                            </form>
                        )}

                    </div>
                </div>

            </main>
        </div>
    );
}