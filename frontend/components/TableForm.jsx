import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from './input';
import Overly from './Overly';

const tableSchema = z.object({
    tableNumber: z.coerce.number().int().positive("Table number must be a positive integer"),
    capacity: z.coerce.number().int().positive("Capacity must be a positive integer"),
    status: z.enum(["available", "occupied", "cleaning"]).default("available")
});

function TableForm({
    isOpen,
    onClose,
    editingTable,
    onSubmit,
    isPending
}) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            tableNumber: "",
            capacity: "",
            status: "available"
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editingTable) {
                reset({
                    tableNumber: editingTable.tableNumber || "",
                    capacity: editingTable.capacity || "",
                    status: editingTable.status || "available"
                });
            } else {
                reset({
                    tableNumber: "",
                    capacity: "",
                    status: "available"
                });
            }
        }
    }, [editingTable, isOpen, reset]);

    const handleFormClose = () => {
        reset({
            tableNumber: "",
            capacity: "",
            status: "available"
        });
        onClose();
    };

    return (
        <Overly
            title={editingTable ? "Edit Table" : "Add New Table"}
            isOpen={isOpen}
            onClose={handleFormClose}
            maxWidth="max-w-md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input
                    type="number"
                    placeholder="e.g. 5"
                    label="Table Number"
                    error={errors.tableNumber}
                    {...register("tableNumber")}
                />
                
                <Input
                    type="number"
                    placeholder="e.g. 4"
                    label="Capacity (Seats)"
                    error={errors.capacity}
                    {...register("capacity")}
                />

                <div className="w-full flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Initial Status</label>
                    <select
                        {...register("status")}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-md text-sm text-black focus:outline-none transition-all duration-200
                            ${errors.status
                                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-[#41431B] focus:ring-1 focus:ring-[#41431B]/20'
                            }`}
                    >
                        <option value="available" className="bg-white text-black">Available</option>
                        <option value="occupied" className="bg-white text-black">Occupied</option>
                        <option value="cleaning" className="bg-white text-black">Cleaning</option>
                    </select>
                    {errors.status && (
                        <span className="text-xs text-red-400 font-medium">{errors.status.message}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-3 text-white cursor-pointer bg-[#41431B] hover:bg-[#515422] transition-colors rounded-lg font-semibold mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (editingTable ? "Saving..." : "Adding...") : (editingTable ? "Save Changes" : "Add Table")}
                </button>
            </form>
        </Overly>
    );
}

export default TableForm;
