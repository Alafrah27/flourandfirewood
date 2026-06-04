"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, FileText } from "lucide-react";

export const DragDropInput = ({
    label,
    error,
    value, // Selected file or file list
    onChange, // Callback to update the state / react-hook-form value
    accept = "image/*",
    multiple = false,
    className = "",
    placeholder = "Drag and drop your file here, or click to browse",
    id,
}) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            if (onChange) {
                onChange(multiple ? files : files[0]);
            }
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            const files = Array.from(e.target.files);
            if (onChange) {
                onChange(multiple ? files : files[0]);
            }
        }
    };

    const onButtonClick = (e) => {
        // Prevent click events from propagating to parent elements
        e.stopPropagation();
        fileInputRef.current.click();
    };

    const removeFile = (e, indexToRemove) => {
        e.stopPropagation();
        if (!onChange) return;
        if (multiple) {
            const currentFiles = Array.isArray(value) ? value : [];
            const updatedFiles = currentFiles.filter((_, idx) => idx !== indexToRemove);
            onChange(updatedFiles.length > 0 ? updatedFiles : null);
        } else {
            onChange(null);
        }
    };

    // Helper to render preview
    const renderPreview = () => {
        if (!value) return null;

        const files = multiple ? (Array.isArray(value) ? value : [value]) : [value];

        return (
            <div className="w-full mt-4 space-y-3">
                {files.map((file, idx) => {
                    const isImage = file.type?.startsWith("image/") || (typeof file === "string" && file.match(/\.(jpeg|jpg|gif|png|webp)/i));
                    const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;
                    const fileName = file instanceof File ? file.name : "Uploaded Asset";
                    const fileSize = file instanceof File ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "";

                    return (
                        <div 
                            key={idx} 
                            className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl gap-4"
                            onClick={(e) => e.stopPropagation()} // Prevent opening file picker on preview click
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {isImage ? (
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                        <img 
                                            src={fileUrl} 
                                            alt={fileName} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-slate-400">
                                        <FileText size={24} />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{fileName}</p>
                                    {fileSize && <p className="text-xs text-slate-500">{fileSize}</p>}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => removeFile(e, idx)}
                                className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </label>
            )}
            
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`relative w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200
                    ${isDragActive 
                        ? "border-[#A2A657] bg-[#41431B]/15 scale-[1.01]" 
                        : error 
                            ? "border-red-500/40 bg-red-500/5 hover:border-red-500/60" 
                            : "border-white/10 bg-white/5 hover:border-white/20"
                    } ${className}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    id={id}
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                />
                
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A2A657]">
                    <UploadCloud size={24} />
                </div>
                
                <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-white">
                        {placeholder}
                    </p>
                    <p className="text-xs text-slate-500">
                        Supports images,  up to 10MB
                    </p>
                </div>
            </div>

            {error && (
                <span className="text-xs text-red-400 font-medium">
                    {error.message || error}
                </span>
            )}

            {renderPreview()}
        </div>
    );
};

export default DragDropInput;
