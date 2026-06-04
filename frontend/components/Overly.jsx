"use client"
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

function Overly({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
    // Prevent background scrolling when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Close"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body (Scrollable if content is too long) */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Overly;
