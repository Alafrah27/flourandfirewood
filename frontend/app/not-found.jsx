import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0b05] px-6">
            <div className="w-full max-w-md text-center">
                {/* 404 Number */}
                <p className="text-8xl font-black text-white/5 tracking-tighter select-none">404</p>

                {/* Message */}
                <h1 className="text-2xl font-bold text-white tracking-wide -mt-4">Page Not Found</h1>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                {/* Action */}
                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#41431B] hover:bg-[#52541f] text-white text-sm font-semibold rounded-xl transition-all"
                    >
                        <Home size={14} />
                        Back to Home
                    </Link>
                </div>

                {/* Brand footer */}
                <p className="mt-10 text-[10px] text-slate-600 uppercase tracking-widest">flour & firewood</p>
            </div>
        </div>
    );
}
