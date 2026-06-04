
import React from 'react'

function SkeletonLoader() {
    return (
        <div className='w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md animate-pulse'>
            <div className="h-12 bg-white/5 border-b border-white/10 w-full"></div>
            <div className="divide-y divide-white/5">
                {[1, 2, 3, 4, 5].map((idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/5"></div>
                            <div className="flex flex-col gap-2">
                                <div className="h-4 w-28 bg-white/5 rounded"></div>
                                <div className="h-3 w-40 bg-white/5 rounded"></div>
                            </div>
                        </div>
                        <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                        <div className="h-8 w-8 bg-white/5 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkeletonLoader