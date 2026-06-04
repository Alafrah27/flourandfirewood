import React from 'react';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import ImageKit from './ImageKIt';
import { currencyFormate } from '../utils/currencyformate';

export default function MenuCard({ product }) {
    if (!product) return null;

    return (
        <Link
            href={`/${product._id}`}
            className="group bg-white rounded-3xl overflow-hidden  transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full cursor-pointer"
        >
            {/* Image Wrapper */}
            <div className="h-[220px] w-full relative overflow-hidden bg-slate-50">
                {product.productImage ? (
                    <ImageKit
                        src={product.productImage}
                        alt={product.productName}
                        width={400}
                        height={300}
                        transformation={[
                            { height: 300, width: 400, cropMode: "fo-auto" },
                            { quality: "auto" }
                        ]}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 font-medium">
                        No Image Available
                    </div>
                )}

                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#41431B] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                    {product.productCategory}
                </span>
            </div>

            {/* Card Details */}
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">
                            {product.rating ? product.rating.toFixed(1) : "5.0"}
                        </span>
                        <span className="text-slate-400 font-light">
                            ({product.numReviews || 12}+)
                        </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#41431B] transition-colors duration-300 line-clamp-1">
                        {product.productName}
                    </h3>

                    {/* Product Description */}
                    <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-2">
                        {product.productDescription}
                    </p>
                </div>

                {/* Price and Action */}
                <div className="flex justify-between items-center pt-6 mt-4 border-t border-slate-100">
                    <span className="text-2xl font-extrabold text-[#41431B]">
                        {product.productPrice ? currencyFormate(product.productPrice) : currencyFormate(0)}
                    </span>

                    <div
                        className="h-10 w-10 bg-[#41431B]/5 text-[#41431B] group-hover:bg-[#41431B] group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:rotate-90"
                        title="View Details"
                    >
                        <Plus size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
