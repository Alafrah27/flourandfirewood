import React from 'react';

// Product Grid Loading Skeleton
export function ProductGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px] animate-pulse"
                >
                    <div className="h-[220px] bg-slate-100 w-full" />
                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-100 rounded w-1/4" />
                            <div className="h-6 bg-slate-100 rounded w-3/4" />
                            <div className="h-4 bg-slate-100 rounded w-full" />
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="h-6 bg-slate-100 rounded w-1/3" />
                            <div className="h-8 bg-slate-100 rounded-full w-8" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Category Pills Loading Skeleton
export function CategorySkeleton({ count = 5 }) {
    return (
        <>
            {[...Array(count)].map((_, idx) => (
                <div
                    key={idx}
                    className="px-6 py-2.5 h-[34px] w-24 bg-white border border-slate-100 rounded-full animate-pulse flex-shrink-0"
                />
            ))}
        </>
    );
}
