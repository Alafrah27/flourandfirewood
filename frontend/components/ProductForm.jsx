import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from './input';
import DragDropInput from './DragDropInput';
import Overly from './Overly';
import { X } from 'lucide-react';

const sideSchema = z.object({
    side_name: z.string().min(1, "Side name is required"),
    side_price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    side_image: z.any().optional()
});

const productSchema = z.object({
    productName: z.string().min(2, "Product name must be at least 2 characters"),
    productPrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
    productDescription: z.string().min(5, "Description must be at least 5 characters"),
    productCategory: z.string().min(1, "Category is required"),
    productImage: z.any().refine((val) => val !== null && val !== undefined && val !== "", "Product image is required"),
    featured: z.boolean().default(false),
    sides: z.array(sideSchema).default([])
});

function ProductForm({
    isOpen,
    onClose,
    editingProduct,
    categories = [],
    onSubmit,
    isPending
}) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productName: "",
            productPrice: "",
            productDescription: "",
            productCategory: "",
            productImage: null,
            featured: false,
            sides: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sides"
    });

    useEffect(() => {
        if (isOpen) {
            if (editingProduct) {
                reset({
                    productName: editingProduct.productName || "",
                    productPrice: editingProduct.productPrice || "",
                    productDescription: editingProduct.productDescription || "",
                    productCategory: editingProduct.productCategory || "",
                    productImage: editingProduct.productImage || null,
                    featured: editingProduct.featured || false,
                    sides: editingProduct.side ? editingProduct.side.map(s => ({
                        side_name: s.side_name || "",
                        side_price: s.side_price || "",
                        side_image: s.side_image || null,
                        side_imagekitFileId: s.side_imagekitFileId || null
                    })) : []
                });
            } else {
                reset({
                    productName: "",
                    productPrice: "",
                    productDescription: "",
                    productCategory: "",
                    productImage: null,
                    featured: false,
                    sides: []
                });
            }
        }
    }, [editingProduct, isOpen, reset]);

    const handleFormClose = () => {
        reset({
            productName: "",
            productPrice: "",
            productDescription: "",
            productCategory: "",
            productImage: null,
            featured: false,
            sides: []
        });
        onClose();
    };

    return (
        <Overly
            title={editingProduct ? "Edit Product" : "Add Product"}
            isOpen={isOpen}
            onClose={handleFormClose}
            maxWidth="max-w-3xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Row 1: Name and Price */}
                <div className="flex flex-row gap-4 w-full">
                    <Input
                        type="text"
                        placeholder="Product Name"
                        label="Product Name"
                        error={errors.productName}
                        {...register("productName")}
                    />
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="Product Price"
                        label="Product Price"
                        error={errors.productPrice}
                        {...register("productPrice")}
                    />
                </div>

                {/* Row 2: Description and Category */}
                <div className="flex flex-row gap-4 w-full">
                    <Input
                        type="text"
                        placeholder="Product Description"
                        label="Description"
                        error={errors.productDescription}
                        {...register("productDescription")}
                    />

                    {/* Category Select Dropdown */}
                    <div className="w-full flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
                        <select
                            {...register("productCategory")}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-md text-sm text-black focus:outline-none transition-all duration-200
                                ${errors.productCategory
                                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                                    : 'border-gray-100 focus:border-[#41431B] focus:ring-1 focus:ring-[#41431B]/20'
                                }`}
                        >
                            <option value="" className="bg-white text-black">Select Category</option>
                            {categories?.map((cat) => (
                                <option key={cat._id} value={cat.categoryName} className="bg-white text-black">
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                        {errors.productCategory && (
                            <span className="text-xs text-red-400 font-medium">{errors.productCategory.message}</span>
                        )}
                    </div>
                </div>

                {/* Row 3: Drag & Drop Image and Featured Toggle */}
                <div className="flex flex-row gap-4 w-full items-end">
                    <div className="w-1/2">
                        <Controller
                            name="productImage"
                            control={control}
                            render={({ field }) => (
                                <DragDropInput
                                    label="Product Image"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.productImage}
                                />
                            )}
                        />
                    </div>

                    {/* Featured Toggle Button/Checkbox */}
                    <div className="w-1/2 flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl mb-1.5 h-[62px]">
                        <input
                            id="featured"
                            type="checkbox"
                            {...register("featured")}
                            className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#41431B] focus:ring-[#41431B]"
                        />
                        <label htmlFor="featured" className="text-sm font-semibold text-slate-300 cursor-pointer select-none">
                            Featured Product
                        </label>
                    </div>
                </div>

                {/* Divider for Side Item Section */}
                <div className="border-t border-slate-100 my-2 pt-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Side Items</h3>
                    <button
                        type="button"
                        onClick={() => append({ side_name: "", side_price: "", side_image: null })}
                        className="px-3 py-1.5 border border-[#41431B]/50 text-[#41431B] hover:bg-[#41431B] hover:text-white transition-colors rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        + Add Side
                    </button>
                </div>

                {/* List of Dynamic Sides */}
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                            {/* Delete Side Button */}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove Side"
                            >
                                <X size={16} />
                            </button>

                            {/* Row 4: Side Name and Side Price */}
                            <div className="flex flex-row gap-4 w-full pt-2">
                                <Input
                                    type="text"
                                    placeholder="Side Name (e.g., French Fries)"
                                    label={`Side #${index + 1} Name`}
                                    error={errors.sides?.[index]?.side_name}
                                    {...register(`sides.${index}.side_name`)}
                                />
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Side Price"
                                    label={`Side #${index + 1} Price`}
                                    error={errors.sides?.[index]?.side_price}
                                    {...register(`sides.${index}.side_price`)}
                                />
                            </div>

                            {/* Row 5: Side Image Drag & Drop */}
                            <div className="flex flex-row gap-4 w-full items-end">
                                <div className="w-1/2">
                                    <Controller
                                        name={`sides.${index}.side_image`}
                                        control={control}
                                        render={({ field: imageField }) => (
                                            <DragDropInput
                                                label={`Side #${index + 1} Image`}
                                                value={imageField.value}
                                                onChange={imageField.onChange}
                                                error={errors.sides?.[index]?.side_image}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="w-1/2 h-[62px]" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-3 text-white cursor-pointer bg-[#41431B] hover:bg-[#515422] transition-colors rounded-lg font-semibold mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (editingProduct ? "Saving..." : "Adding...") : (editingProduct ? "Save Changes" : "Add Product")}
                </button>
            </form>
        </Overly>
    );
}

export default ProductForm;
