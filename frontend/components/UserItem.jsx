import React from 'react'
import { Trash2, Edit, ChevronLeft, ChevronRight, Users, Shield, Mail } from 'lucide-react'
import SkeletonLoader from './SkeletonLoader';
import ImageKit from './ImageKIt';
import ActionMenu from './ActionMenu';

function UserItem({
    usersData = [],
    isLoading = false,
    error = null,
    pagination = {},
    onPageChange,
    onDeleteUser,
    isDeleting = false
}) {

    // Render skeleton loaders for loading state
    if (isLoading) return <SkeletonLoader />

    // Render error message
    if (error) {
        return (
            <div className="w-full p-6 text-center text-rose-400 border border-rose-500/10 bg-rose-500/5 rounded-2xl animate-fade-in">
                <p className="font-semibold">Error Loading Users</p>
                <p className="text-xs mt-1 text-slate-400">{error.message || "Something went wrong."}</p>
            </div>
        );
    }

    // Render empty state
    if (usersData.length === 0) {
        return (
            <div className="w-full text-center py-20 text-slate-400 border border-white/10 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500">
                    <Users size={32} />
                </div>
                <p className="font-semibold text-white">No Customers Found</p>
                <p className="text-xs text-slate-500 max-w-xs">We couldn&apos;t find any customers matching your search criteria.</p>
            </div>
        );
    }
    // Pagination calculations
    const { totalUsers = 0, totalPages = 1, currentPage = 1, limit = 5, hasNext = false, hasPrev = false } = pagination || {};
    const startEntry = totalUsers > 0 ? (currentPage - 1) * limit + 1 : 0;
    const endEntry = Math.min(currentPage * limit, totalUsers);

    return (
        <div className='w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5  flex flex-col justify-between h-full'>
            {/* Table wrapper for horizontal scroll on small devices */}
            <div className="overflow-x-auto w-full">
                <table className='w-full text-sm font-light text-left border-collapse'>
                    <thead>
                        <tr className='bg-white/5 border-b border-white/10 text-slate-300 font-semibold text-xs tracking-wider uppercase'>
                            <th className='p-4 text-start font-bold'>Customer</th>
                            <th className='p-4 text-start font-bold hidden md:table-cell'>Email Address</th>
                            <th className='p-4 text-center font-bold'>Role</th>
                            <th className='p-4 text-center font-bold'>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {usersData.map((user) => (
                            <tr key={user._id} className='hover:bg-white/5 transition-all text-slate-200 group'>
                                {/* Customer Info (Image & Name) */}
                                <td className='p-4 text-start'>
                                    <div className="flex items-center gap-3">
                                        {user.imageUrl ? (
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                                                <ImageKit
                                                    src={user.imageUrl}
                                                    alt={user.fullname || "User"}
                                                    width={40}
                                                    height={40}
                                                    transformation={[
                                                        { height: 80, width: 80, cropMode: "fo-auto" },
                                                        { quality: "auto" }
                                                    ]}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-[#41431B]/40 flex items-center justify-center font-bold text-white text-sm border border-white/10 flex-shrink-0">
                                                {user.fullname ? user.fullname.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "?")}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white">{user.fullname || "Anonymous User"}</span>
                                            {/* Show email under name on small screens */}
                                            <span className="text-slate-400 text-xs flex items-center gap-1 md:hidden mt-0.5">
                                                <Mail size={12} className="text-slate-500" /> {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Email Column (hidden on mobile, shown on md+) */}
                                <td className='p-4 text-start hidden md:table-cell'>
                                    <span className="text-slate-300">{user.email}</span>
                                </td>

                                {/* Role Column */}
                                <td className='p-4 text-center'>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${user.role === "admin"
                                        ? "bg-[#41431B]/30 text-[#e9ebc7] border-[#41431B]/50"
                                        : "bg-white/5 text-slate-400 border-white/10"
                                        }`}>
                                        <Shield size={12} />
                                        {user.role === "admin" ? "Admin" : "User"}
                                    </span>
                                </td>

                                {/* Actions Column */}
                                <td className='p-4 text-center'>
                                    <div className="flex justify-center">
                                        <ActionMenu
                                            actions={[
                                                {
                                                    label: 'Edit',
                                                    icon: Edit,
                                                    onClick: () => {
                                                        alert(`Demo: Edit user ${user.fullname || user.email}`);
                                                    }
                                                },
                                                {
                                                    label: 'Delete',
                                                    icon: Trash2,
                                                    onClick: () => onDeleteUser(user),
                                                    danger: true
                                                }
                                            ]}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalUsers > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/10 bg-white/5 gap-4">
                    <span className="text-xs text-slate-400">
                        Showing <span className="font-semibold text-white">{startEntry}</span> to <span className="font-semibold text-white">{endEntry}</span> of <span className="font-semibold text-white">{totalUsers}</span> customers
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={!hasPrev || isDeleting}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold"
                        >
                            <ChevronLeft size={14} />
                            Prev
                        </button>

                        {/* Generate Page Numbers */}
                        {totalPages > 1 && Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageIdx) => (
                            <button
                                key={pageIdx}
                                onClick={() => onPageChange(pageIdx)}
                                disabled={isDeleting}
                                className={`h-8 w-8 text-xs font-semibold rounded-xl cursor-pointer transition-all ${currentPage === pageIdx
                                    ? "bg-[#41431B] text-white font-bold"
                                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {pageIdx}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={!hasNext || isDeleting}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold"
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserItem