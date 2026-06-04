export default function DashboardLoading() {
    return (
        <div className="w-full flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-5">
                {/* Animated spinner */}
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#D9C4A0] animate-spin" />
                    <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-[#41431B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <p className="text-xs text-slate-500 animate-pulse">Loading content...</p>
                </div>
            </div>
        </div>
    );
}
