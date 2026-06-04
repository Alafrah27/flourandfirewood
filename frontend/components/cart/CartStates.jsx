import React from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { ShoppingBag, Trash2, ChevronRight } from "lucide-react";
import Navbar from "../navbar";

// ─── Loading Skeleton View ───────────────────────────────────────────────────
export const CartLoadingSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 flex-grow max-w-6xl space-y-8">
        <div className="h-10 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white border border-slate-100 rounded-3xl animate-pulse"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex-shrink-0" />
                <div className="flex-grow space-y-3 w-full">
                  <div className="h-5 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                </div>
                <div className="h-10 bg-slate-100 rounded w-28" />
                <div className="h-6 bg-slate-100 rounded w-16" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 h-80 animate-pulse" />
        </div>
      </main>
    </div>
  );
};

// ─── Auth Guard State (Not Signed In) ─────────────────────────────────────────
export const CartAuthGuard = () => {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center max-w-lg">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm text-center w-full space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="h-16 w-16 bg-[#41431B]/5 text-[#41431B] rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Authentication Required
            </h2>
            <p className="text-slate-500 text-sm font-light leading-relaxed">
              Log in to sync your cart across your devices, customize orders, and explore chef specials.
            </p>
          </div>
          <SignInButton mode="modal">
            <button className="w-full py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md shadow-[#41431B]/15 hover:shadow-[#41431B]/25 hover:scale-[1.01] transition-all duration-300 cursor-pointer text-sm">
              Sign In to View Cart
            </button>
          </SignInButton>
        </div>
      </main>
    </div>
  );
};

// ─── Error State View ──────────────────────────────────────────────────────────
export const CartErrorState = ({ error }) => {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center max-w-lg">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center w-full space-y-6">
          <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
            <Trash2 size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">
              Failed to Load Cart
            </h2>
            <p className="text-slate-500 text-sm font-light">
              {error?.message || "An unexpected error occurred while fetching your cart details."}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#41431B] hover:bg-[#515422] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </main>
    </div>
  );
};

// ─── Empty Cart View ───────────────────────────────────────────────────────────
export const CartEmptyState = () => {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center max-w-md">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm text-center w-full space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="h-16 w-16 bg-[#41431B]/5 text-[#41431B] rounded-3xl flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800">
              Your Cart is Empty
            </h2>
            <p className="text-slate-500 text-sm font-light">
              It looks like you haven&apos;t added any items to your dining bag yet. Take a look at our fresh wood-fired catalog!
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex w-full items-center justify-center gap-2 py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer text-sm"
          >
            Browse Menu Catalog
            <ChevronRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
};
