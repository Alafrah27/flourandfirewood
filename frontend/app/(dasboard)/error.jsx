"use client"

import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardError({ error, reset }) {
    const router = useRouter();

    useEffect(() => {
        console.error("Dashboard Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="w-full flex-1 flex items-center justify-center min-h-[60vh] px-6">
            <div className="w-full max-w-md text-center">
                {/* Error icon */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
                    <AlertTriangle size={28} className="text-rose-400" />
                </div>

                {/* Error message */}
                <h2 className="text-xl font-bold text-white tracking-wide">Page Error</h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    This page encountered an error. Your other pages still work fine.
                </p>

                {/* Error details */}
                {error?.message && (
                    <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3.5 text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Error Details</p>
                        <p className="text-xs text-rose-300/80 font-mono break-all leading-relaxed">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#41431B] hover:bg-[#52541f] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
                    >
                        <RotateCcw size={14} />
                        Retry
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
                    >
                        <ArrowLeft size={14} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
