export default function RootLoading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0b05]">
            <div className="flex flex-col items-center gap-6">
                {/* Animated spinner */}
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#D9C4A0] animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#41431B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>

                {/* Brand text */}
                <div className="text-center">
                    <p className="text-sm font-semibold text-white tracking-widest uppercase">flour & firewood</p>
                    <p className="text-xs text-slate-500 mt-1.5 animate-pulse">Loading...</p>
                </div>
            </div>
        </div>
    );
}
