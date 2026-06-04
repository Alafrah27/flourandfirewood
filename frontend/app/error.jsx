"use client"

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { useEffect } from "react";

export default function RootError({ error, reset }) {
    useEffect(() => {
        console.error("Root Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0b05] px-6">
            <div className="w-full max-w-md text-center">
                {/* Error icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
                    <AlertTriangle size={36} className="text-rose-400" />
                </div>

                {/* Error message */}
                <h1 className="text-2xl font-bold text-white tracking-wide">Something Went Wrong</h1>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    An unexpected error occurred. Don&apos;t worry, your data is safe.
                </p>

                {/* Error details (collapsible) */}
                {error?.message && (
                    <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Error Details</p>
                        <p className="text-xs text-rose-300/80 font-mono break-all leading-relaxed">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#41431B] hover:bg-[#52541f] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
                    >
                        <RotateCcw size={14} />
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all"
                    >
                        <Home size={14} />
                        Go Home
                    </a>
                </div>

                {/* Brand footer */}
                <p className="mt-10 text-[10px] text-slate-600 uppercase tracking-widest">flour & firewood</p>
            </div>
        </div>
    );
}
