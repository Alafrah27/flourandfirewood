import React from 'react';
import { ChevronLeft, ChevronRight, Edit, Star, Trash2 } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';
import ActionMenu from './ActionMenu';
import ImageKit from './ImageKIt';
import { currencyFormate } from '../utils/currencyformate';

function ProductItem({
    productsData = [],
    isLoading = false,
    error = null,
    pagination = {},
    onPageChange,
    onEditProduct,
    onDeleteProduct
}) {
    // Render skeleton loaders for loading state
    if (isLoading) return <SkeletonLoader />;

    // Render error message
    if (error) {
        return (
            <div className="w-full p-6 text-center text-rose-400 border border-rose-500/10 bg-rose-500/5 rounded-2xl animate-fade-in">
                <p className="font-semibold">Error Loading Products</p>
                <p className="text-xs mt-1 text-slate-400">{error.message || "Something went wrong."}</p>
            </div>
        );
    }

    // Render empty state
    if (productsData.length === 0) {
        return (
            <div className="w-full text-center py-20 text-slate-400 border border-white/10 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
                <p className="font-semibold text-white">No Products Found</p>
                <p className="text-xs text-slate-500 max-w-xs">We couldn&apos;t find any products matching your search criteria.</p>
            </div>
        );
    }

    // Pagination calculations
    const { totalProducts = 0, totalPages = 1, currentPage = 1, limit = 5 } = pagination || {};
    const startEntry = totalProducts > 0 ? (currentPage - 1) * limit + 1 : 0;
    const endEntry = Math.min(currentPage * limit, totalProducts);

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between h-full">
            {/* Table wrapper for horizontal scroll */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm font-light text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-slate-300 font-semibold text-xs tracking-wider uppercase">
                            <th className="p-4 text-start font-bold">Image</th>
                            <th className="p-4 text-start font-bold">Name</th>
                            <th className="p-4 text-start font-bold hidden md:table-cell">Description</th>
                            <th className="p-4 text-center font-bold">Featured</th>
                            <th className="p-4 text-center font-bold">Rate</th>
                            <th className="p-4 text-end font-bold">Price</th>
                            <th className="p-4 text-center font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {productsData.map((product) => (
                            <tr key={product._id} className="hover:bg-white/5 transition-all text-slate-200 group">
                                {/* Image */}
                                <td className="p-4 text-start">
                                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0 flex items-center justify-center">
                                        {product.productImage ? (
                                            <ImageKit
                                                src={product.productImage}
                                                alt={product.productName}
                                                width={48}
                                                height={48}
                                                transformation={[
                                                    { height: 96, width: 96, cropMode: "fo-auto" },
                                                    { quality: "auto" }
                                                ]}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] text-slate-600">No Img</span>
                                        )}
                                    </div>
                                </td>

                                {/* Name */}
                                <td className="p-4 text-start">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white">{product.productName}</span>
                                        <span className="text-slate-400 text-xs mt-0.5">{product.productCategory}</span>
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="p-4 text-start hidden md:table-cell text-slate-300 font-light max-w-xs truncate">
                                    {product.productDescription}
                                </td>

                                {/* Featured */}
                                <td className="p-4 text-center">
                                    {product.featured ? (
                                        <span className="inline-flex px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase">
                                            ★ Yes
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 text-xs">-</span>
                                    )}
                                </td>

                                {/* Rate */}
                                <td className="p-4 text-center text-slate-300 font-semibold">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-amber-400 text-xs">★</span>
                                        <span className="text-xs">{product.rating || 0}</span>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="p-4 text-end text-[#D9C4A0] font-extrabold">
                                    {currencyFormate(product.productPrice)}
                                </td>

                                {/* Action (ActionMenu Component) */}
                                <td className="p-4 text-center">
                                    <div className="flex justify-center">
                                        <ActionMenu
                                            actions={[
                                                {
                                                    label: 'Edit',
                                                    icon: Edit,
                                                    onClick: () => onEditProduct(product)
                                                },
                                                {
                                                    label: product.featured ? 'Unfeature' : 'Feature',
                                                    icon: Star,
                                                    onClick: () => {
                                                        alert(`Demo: Toggle featured status for ${product.productName}`);
                                                    }
                                                },
                                                {
                                                    label: 'Delete',
                                                    icon: Trash2,
                                                    onClick: () => onDeleteProduct(product),
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
            {totalProducts > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/10 bg-white/5 gap-4">
                    <span className="text-xs text-slate-400">
                        Showing <span className="font-semibold text-white">{startEntry}</span> to <span className="font-semibold text-white">{endEntry}</span> of <span className="font-semibold text-white">{totalProducts}</span> products
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold"
                        >
                            <ChevronLeft size={14} />
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {totalPages > 1 && Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageIdx) => (
                            <button
                                key={pageIdx}
                                onClick={() => onPageChange(pageIdx)}
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
                            disabled={currentPage >= totalPages}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold"
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductItem;
