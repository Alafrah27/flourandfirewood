"use client"

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Overly from "../../../components/Overly";
import Input from "../../../components/input";
import DragDropInput from "../../../components/DragDropInput";
import Loader from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";
import CategoryItem from "../../../components/CategoryItem";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { 
    useCategories, 
    useCreateCategory, 
    useDeleteCategory, 
    useUpdateCategory 
} from "../../../services/categoryQuery";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Define validation schema
const categorySchema = z.object({
    categoryName: z.string().min(2, "Category name must be at least 2 characters"),
    backgroundColor: z.string().optional(),
    imageUrl: z.any().refine((val) => val !== null && val !== undefined && val !== "", "Category image is required"),
});

export default function Category() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQueryURL = searchParams.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(searchQueryURL);
    const [prevSearchQueryURL, setPrevSearchQueryURL] = useState(searchQueryURL);

    // Sync state with URL parameter changes
    if (searchQueryURL !== prevSearchQueryURL) {
        setSearchQuery(searchQueryURL);
        setPrevSearchQueryURL(searchQueryURL);
    }

    const updateURL = (newParams) => {
        const current = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });
        router.push(`${pathname}?${current.toString()}`);
    };

    // Debounce search input and update URL
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== searchQueryURL) {
                updateURL({ search: searchQuery });
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, searchQueryURL]);
    
    const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();
    const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutateAsync: deleteCategory } = useDeleteCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            categoryName: "",
            backgroundColor: "",
            imageUrl: null
        }
    });

    const onSubmit = async (data) => {
        const loadingToast = toast.loading(editingCategory ? "Updating category..." : "Creating category...");
        try {
            if (editingCategory) {
                const isNewFile = data.imageUrl instanceof File;
                await updateCategory({
                    id: editingCategory._id,
                    categoryName: data.categoryName,
                    backgroundColor: data.backgroundColor || "",
                    imageUrl: isNewFile ? undefined : data.imageUrl,
                    imageFile: isNewFile ? data.imageUrl : undefined
                });
                toast.update(loadingToast, {
                    render: "Category updated successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            } else {
                await createCategory({
                    categoryName: data.categoryName,
                    backgroundColor: data.backgroundColor || "",
                    imageFile: data.imageUrl
                });
                toast.update(loadingToast, {
                    render: "Category created successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            }
            handleClose();
        } catch (err) {
            console.error("Failed to save category:", err);
            toast.update(loadingToast, {
                render: err.message || "Failed to save category",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    const handleDeleteCategory = async (categoryToDel) => {
        if (confirm(`Are you sure you want to delete "${categoryToDel.categoryName}"?`)) {
            const loadingToast = toast.loading("Deleting category...");
            try {
                await deleteCategory(categoryToDel._id);
                toast.update(loadingToast, {
                    render: "Category deleted successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            } catch (error) {
                console.error("Failed to delete category:", error);
                toast.update(loadingToast, {
                    render: error.message || "Failed to delete category",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        }
    };

    const handleEditCategory = (categoryToEdit) => {
        setEditingCategory(categoryToEdit);
        reset({
            categoryName: categoryToEdit.categoryName,
            backgroundColor: categoryToEdit.backgroundColor || "",
            imageUrl: categoryToEdit.imageUrl
        });
        setIsOpen(true);
    };

    const handleClose = () => {
        reset({
            categoryName: "",
            backgroundColor: "",
            imageUrl: null
        });
        setEditingCategory(null);
        setIsOpen(false);
    };

    // Filter categories based on search query
    const filteredCategories = categories?.filter((category) =>
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="w-full px-8 pt-10">
            <h1 className="text-2xl font-bold text-white">Category Management</h1>
            
            <div className="w-full flex items-center justify-end gap-8 mt-3 mb-2">
                <div className="relative max-w-md w-full hidden sm:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Category Name..."
                        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#41431B]/50 focus:ring-1 focus:ring-[#41431B]/20 transition-all"
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        reset({
                            categoryName: "",
                            backgroundColor: "",
                            imageUrl: null
                        });
                        setIsOpen(true);
                    }}
                    className="px-4 py-3 text-white cursor-pointer bg-[#41431B] hover:bg-[#515422] transition-colors rounded-lg font-semibold"
                >
                    Add Category
                </button>
            </div>

            {/* Categories Grid */}
            {isLoadingCategories ? (
                <Loader />
            ) : categoriesError ? (
                <ErrorMessage message={categoriesError.message} />
            ) : filteredCategories.length === 0 ? (
                <div className="text-center py-20 text-slate-400 border border-white/5 bg-white/5 rounded-2xl mt-6">
                    {searchQuery ? "No matching categories found." : "No categories found."}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
                    {filteredCategories.map((category) => (
                        <CategoryItem
                            key={category._id}
                            category={category}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
                        />
                    ))}
                </div>
            )}

            {isOpen && (
                <Overly
                    title={editingCategory ? "Edit Category" : "Add New Category"}
                    onClose={handleClose}
                    isOpen={isOpen}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            type="text"
                            placeholder="Category Name"
                            label="Category Name"
                            error={errors.categoryName}
                            {...register("categoryName")}
                        />
                        <Input
                            type="text"
                            placeholder="Background Color (e.g. #ff0000)"
                            label="Background Color"
                            error={errors.backgroundColor}
                            {...register("backgroundColor")}
                        />
                        <Controller
                            name="imageUrl"
                            control={control}
                            render={({ field }) => (
                                <DragDropInput
                                    label="Category Image"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.imageUrl}
                                />
                            )}
                        />
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="px-4 py-3 text-white cursor-pointer bg-[#41431B] hover:bg-[#515422] transition-colors rounded-lg font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {(isCreating || isUpdating) && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {isCreating || isUpdating ? "Saving..." : editingCategory ? "Save Changes" : "Add Category"}
                        </button>
                    </form>
                </Overly>
            )}
        </div>
    );
}