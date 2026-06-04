"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Clock, Flame, ShieldCheck, ShoppingBag, Check } from 'lucide-react';
import Navbar from '../../../components/navbar';
import ImageKit from '../../../components/ImageKIt';
import { useGetProductById } from '../../../services/productQuery';
import { useAuth } from '@clerk/nextjs';
import { useAddToCart } from '../../../services/cartQuery';
import { toast } from 'react-toastify';
import { currencyFormate } from '../../../utils/currencyformate';

export default function MenuId({ params }) {
    // Unwrap route params in React 19 / Next.js 16
    const resolvedParams = React.use(params);
    const productId = resolvedParams?.id || "";

    const { data: product, isLoading, error } = useGetProductById(productId);
    const { isSignedIn } = useAuth();
    const { mutateAsync: addToCart, isPending: isAdding } = useAddToCart();

    // Configurator state
    const [quantity, setQuantity] = useState(1);
    const [selectedSides, setSelectedSides] = useState([]);

    const handleAddToOrder = async () => {
        if (!isSignedIn) {
            toast.warning("Please sign in to add items to your cart", {
                position: "top-center"
            });
            return;
        }

        const toastId = toast.loading("Adding item to cart...");
        try {
            await addToCart({ productId, quantity, sides: selectedSides });
            toast.update(toastId, {
                render: "Item added to cart successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Failed to add item to cart.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    // Calculate dynamic pricing
    const basePrice = product?.productPrice || 0;
    const sidesPrice = selectedSides.reduce((sum, sideName) => {
        const sideItem = product?.side?.find(s => s.side_name === sideName);
        return sum + (sideItem?.side_price || 0);
    }, 0);
    const totalPrice = (basePrice + sidesPrice) * quantity;

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const toggleSide = (sideName) => {
        if (selectedSides.includes(sideName)) {
            setSelectedSides(selectedSides.filter(name => name !== sideName));
        } else {
            setSelectedSides([...selectedSides, sideName]);
        }
    };

    // Helper skeleton loader for details view
    const renderSkeletons = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full animate-pulse">
                {/* Left image column skeleton */}
                <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl h-[400px] md:h-[500px]" />
                
                {/* Right metadata column skeleton */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="h-6 bg-slate-200 rounded w-1/4" />
                    <div className="h-10 bg-slate-200 rounded w-3/4" />
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-20 bg-slate-200 rounded w-full" />
                    <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div className="h-6 bg-slate-200 rounded w-1/3" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-slate-200 rounded-2xl" />
                            <div className="h-20 bg-slate-200 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-12 flex-grow max-w-6xl">
                {/* Back to Catalog Link */}
                <div className="mb-8">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#41431B] font-semibold text-sm transition-colors cursor-pointer group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Menu Catalog
                    </Link>
                </div>

                {/* Loading state */}
                {isLoading && renderSkeletons()}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 border border-rose-100 rounded-3xl text-center max-w-lg mx-auto">
                        <Star className="text-rose-400 mb-4 animate-bounce" size={40} />
                        <h3 className="text-lg font-bold text-slate-800">Failed to load details</h3>
                        <p className="text-sm text-slate-500 mt-2">
                            {error.message || "We encountered an issue fetching the product details. Please try again."}
                        </p>
                        <Link
                            href="/menu"
                            className="mt-6 px-6 py-2.5 bg-[#41431B] hover:bg-[#515422] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Back to Menu
                        </Link>
                    </div>
                )}

                {/* Complete Detail view */}
                {!isLoading && !error && product && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
                        
                        {/* Left Column: Image and Trust Badges */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Card wrapper */}
                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm relative">
                                <div className="h-[350px] md:h-[450px] w-full relative bg-slate-50">
                                    {product.productImage ? (
                                        <ImageKit
                                            src={product.productImage}
                                            alt={product.productName}
                                            width={600}
                                            height={450}
                                            transformation={[
                                                { height: 600, width: 800, cropMode: "fo-auto" },
                                                { quality: "auto" }
                                            ]}
                                            className="h-full w-full object-cover"
                                            loading="eager"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 font-medium">
                                            No Image Available
                                        </div>
                                    )}

                                    {/* Float Category Badge */}
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#41431B] text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm">
                                        {product.productCategory}
                                    </span>
                                </div>
                            </div>

                            {/* Trust badges row */}
                            <div className="grid grid-cols-3 gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <Flame size={20} className="text-[#41431B]" />
                                    <span className="text-[10px] font-extrabold text-slate-800 uppercase mt-1">Fresh Hearth</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Clock size={20} className="text-[#41431B]" />
                                    <span className="text-[10px] font-extrabold text-slate-800 uppercase mt-1">Quick Cook</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <ShieldCheck size={20} className="text-[#41431B]" />
                                    <span className="text-[10px] font-extrabold text-slate-800 uppercase mt-1">Hygienic Prep</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 space-y-8 py-2">
                            
                            {/* Product Info */}
                            <div className="space-y-4">
                                {/* Rating indicator */}
                                <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                                    <Star size={16} className="fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-700">
                                        {product.rating ? product.rating.toFixed(1) : "5.0"}
                                    </span>
                                    <span className="text-slate-400 font-light">
                                        ({product.numReviews || 12}+ reviews)
                                    </span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                                    {product.productName}
                                </h2>

                                <p className="text-2xl font-extrabold text-[#41431B]">
                                    {currencyFormate(basePrice)}
                                </p>

                                <p className="text-slate-500 text-sm font-light leading-relaxed">
                                    {product.productDescription}
                                </p>
                            </div>

                            {/* Sides options configurator */}
                            {product.side && product.side.length > 0 && (
                                <div className="border-t border-slate-100 pt-6 space-y-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                            Select Side Add-ons
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Customize your plate to your liking</p>
                                    </div>

                                    {/* Grid of side cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {product.side.map((item) => {
                                            const isSelected = selectedSides.includes(item.side_name);
                                            return (
                                                <button
                                                    key={item.side_name}
                                                    type="button"
                                                    onClick={() => toggleSide(item.side_name)}
                                                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                                                        isSelected
                                                            ? "bg-[#41431B]/5 border-[#41431B] shadow-sm"
                                                            : "bg-white border-slate-100 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Side thumbnail */}
                                                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                                                            {item.side_image ? (
                                                                <ImageKit
                                                                    src={item.side_image}
                                                                    alt={item.side_name}
                                                                    width={40}
                                                                    height={40}
                                                                    transformation={[
                                                                        { height: 80, width: 80, cropMode: "fo-auto" },
                                                                        { quality: "auto" }
                                                                    ]}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-[8px] text-slate-400">Side</span>
                                                            )}
                                                        </div>

                                                        {/* Side text */}
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-700 line-clamp-1">{item.side_name}</p>
                                                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">+ {currencyFormate(item.side_price)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Selection bubble */}
                                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
                                                        isSelected
                                                            ? "bg-[#41431B] border-[#41431B] text-white"
                                                            : "border-slate-300"
                                                    }`}>
                                                        {isSelected && <Check size={12} strokeWidth={3} />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity selection configurations */}
                            <div className="border-t border-slate-100 pt-6 space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                    Quantity
                                </h4>
                                
                                <div className="flex items-center border border-slate-200 rounded-2xl w-fit overflow-hidden bg-white shadow-sm">
                                    <button
                                        type="button"
                                        onClick={handleDecrement}
                                        className="px-5 py-3 hover:bg-slate-50 text-slate-600 transition-colors font-bold text-lg cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 font-extrabold text-slate-800 text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleIncrement}
                                        className="px-5 py-3 hover:bg-slate-50 text-slate-600 transition-colors font-bold text-lg cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Sticky-feel checkout total actions */}
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                                <div className="text-center sm:text-left">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Price</p>
                                    <p className="text-3xl font-extrabold text-[#41431B] mt-0.5">{currencyFormate(totalPrice)}</p>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={handleAddToOrder}
                                    disabled={isAdding}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md hover:shadow-lg shadow-[#41431B]/15 hover:shadow-[#41431B]/25 transition-all duration-300 hover:scale-[1.01] cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag size={18} />
                                    {isAdding ? "Adding..." : "Add to Order"}
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
