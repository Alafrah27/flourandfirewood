"use client"
import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import ProductItem from "../../../components/ProductItem";
import ProductForm from "../../../components/ProductForm";
import { useCategories } from "../../../services/categoryQuery";
import { useCreateProduct, useGetProducts, useDeleteProduct, useUpdateProduct } from "../../../services/productQuery";
import { toast } from "react-toastify";
import { useSearchParams, useRouter, usePathname } from "next/navigation";



function Menu() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = parseInt(searchParams.get("page")) || 1;
    const categoryFilter = searchParams.get("category") || "";
    const sortFilter = searchParams.get("sort") || "";
    const featuredFilter = searchParams.get("featured") || "";
    const searchQueryURL = searchParams.get("search") || "";

    const [searchQuery, setSearchQuery] = useState(searchQueryURL);
    const [prevSearchQueryURL, setPrevSearchQueryURL] = useState(searchQueryURL);
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const sortDropdownRef = React.useRef(null);
    const categoryDropdownRef = React.useRef(null);

    // Adjust state during render when URL search params change externally
    if (searchQueryURL !== prevSearchQueryURL) {
        setSearchQuery(searchQueryURL);
        setPrevSearchQueryURL(searchQueryURL);
    }

    // Enforce limit=5 in URL immediately on mount/update
    React.useEffect(() => {
        const currentLimit = searchParams.get("limit");
        if (currentLimit !== "5") {
            const current = new URLSearchParams(searchParams.toString());
            current.set("limit", "5");
            router.replace(`${pathname}?${current.toString()}`);
        }
    }, [searchParams, router, pathname]);

    // Handle click outside to close three-dots dropdown menu and sort/category dropdowns
    React.useEffect(() => {
        const handleOutsideClick = (e) => {
            setActiveMenuId(null);
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const updateURL = (newParams) => {
        const current = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });
        current.set("limit", "5");
        router.push(`${pathname}?${current.toString()}`);
    };

    // Debounce search input and update URL
    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== searchQueryURL) {
                updateURL({ search: searchQuery, page: 1 });
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, searchQueryURL]);

    const handleCategoryChange = (category) => {
        updateURL({ category, page: 1 });
    };

    const handleSortChange = (sort) => {
        updateURL({ sort, page: 1 });
    };

    const handleFeaturedChange = (featured) => {
        updateURL({ featured, page: 1 });
    };

    const handlePageChange = (newPage) => {
        updateURL({ page: newPage });
    };

    const { data: categories } = useCategories();

    // Fetch products
    const { data, isLoading, error } = useGetProducts({
        page,
        limit: 5,
        category: categoryFilter,
        sort: sortFilter,
        featured: featuredFilter,
        search: searchQueryURL
    });

    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const { mutateAsync: deleteProduct } = useDeleteProduct();

    const isPending = isCreating || isUpdating;

    const handleClose = () => {
        setEditingProduct(null);
        setIsOpen(false);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsOpen(true);
    };

    const handleDeleteProduct = async (product) => {
        if (confirm(`Are you sure you want to delete ${product.productName}?`)) {
            const loadingToast = toast.loading("Deleting product...");
            try {
                await deleteProduct(product._id);
                toast.update(loadingToast, {
                    render: "Product deleted successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            } catch (err) {
                console.error("Delete product failed:", err);
                toast.update(loadingToast, {
                    render: err.message || "Failed to delete product",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        }
    };

    const onSubmit = async (formData) => {
        if (editingProduct) {
            updateProduct({ id: editingProduct._id, ...formData, imagekitFileId: editingProduct.imagekitFileId }, {
                onSuccess: () => {
                    toast.success("Product updated successfully!");
                    handleClose();
                },
                onError: (err) => {
                    toast.error(err.message || "Failed to update product");
                }
            });
        } else {
            createProduct(formData, {
                onSuccess: () => {
                    toast.success("Product created successfully!");
                    handleClose();
                },
                onError: (err) => {
                    toast.error(err.message || "Failed to create product");
                }
            });
        }
    };
    return (
        <div className="w-full px-8 pt-10 flex flex-col min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Menu Management</h1>
                    <p className="text-slate-400 text-xs mt-1">Create, edit, and categorize your flour&wood oven artisan menu items</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setIsOpen(true);
                    }}
                    className="px-4 py-3 text-white cursor-pointer bg-[#41431B] hover:bg-[#515422] transition-colors rounded-lg font-semibold w-fit"
                >
                    Add Menu Item
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-6 mb-8 bg-white/5 border border-white/10 rounded-2xl p-4">
                {/* Search Input */}
                <div className="relative w-full xl:w-96">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, description..."
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#41431B]/50 focus:ring-1 focus:ring-[#41431B]/20 transition-all"
                    />
                </div>

                {/* Category Pills & Sort Selects */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full xl:w-auto">
                    {/* Custom Category Dropdown Selector */}
                    <div ref={categoryDropdownRef} className="relative inline-block text-left w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setIsCategoryOpen(!isCategoryOpen);
                                setIsSortOpen(false);
                                setActiveMenuId(null);
                            }}
                            className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full md:w-auto min-w-[140px]"
                        >
                            <span>
                                {categoryFilter === "" ? "Category: All" : `Category: ${categoryFilter}`}
                            </span>
                            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isCategoryOpen && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute left-0 md:right-0 md:left-auto mt-1.5 w-full md:w-48 bg-[#12130c]/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-y-auto max-h-60 py-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
                            >
                                <button
                                    onClick={() => {
                                        handleCategoryChange("");
                                        setIsCategoryOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${categoryFilter === ""
                                            ? "bg-[#41431B] text-white"
                                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    All Categories
                                </button>
                                {categories?.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => {
                                            handleCategoryChange(cat.categoryName);
                                            setIsCategoryOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${categoryFilter === cat.categoryName
                                                ? "bg-[#41431B] text-white"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {cat.categoryName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Featured Filter */}
                        <button
                            onClick={() => handleFeaturedChange(featuredFilter === "true" ? "" : "true")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${featuredFilter === "true"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold"
                                : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                                }`}
                        >
                            ★ Featured Only
                        </button>

                        {/* Custom Sort Select Dropdown */}
                        <div ref={sortDropdownRef} className="relative inline-block text-left">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSortOpen(!isSortOpen);
                                    setActiveMenuId(null); // Close three-dots if open
                                }}
                                className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer min-w-[140px]"
                            >
                                <span>
                                    {sortFilter === "" && "Sort: Latest"}
                                    {sortFilter === "asc" && "Name: A-Z"}
                                    {sortFilter === "desc" && "Name: Z-A"}
                                    {sortFilter === "highest" && "Price: High to Low"}
                                    {sortFilter === "lowest" && "Price: Low to High"}
                                </span>
                                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isSortOpen && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 mt-1.5 w-48 bg-[#12130c]/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
                                >
                                    {[
                                        { value: "", label: "Sort: Latest" },
                                        { value: "asc", label: "Name: A-Z" },
                                        { value: "desc", label: "Name: Z-A" },
                                        { value: "highest", label: "Price: High to Low" },
                                        { value: "lowest", label: "Price: Low to High" }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleSortChange(option.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${sortFilter === option.value
                                                    ? "bg-[#41431B] text-white"
                                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table Wrapper */}
            <div className="flex-grow">
                <ProductItem
                    productsData={data?.products || []}
                    isLoading={isLoading}
                    error={error}
                    pagination={{
                        totalProducts: data?.totalProducts || 0,
                        totalPages: data?.totalPages || 0,
                        currentPage: page,
                        limit: 5
                    }}
                    onPageChange={handlePageChange}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                />
            </div>

            {isOpen && (
                <ProductForm
                    isOpen={isOpen}
                    onClose={handleClose}
                    editingProduct={editingProduct}
                    categories={categories}
                    onSubmit={onSubmit}
                    isPending={isPending}
                />
            )}
        </div>
    );
}

export default Menu;