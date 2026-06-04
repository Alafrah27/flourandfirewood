import React,{forwardRef} from 'react';

export const Input = forwardRef(({ 
    label, 
    type = 'text', 
    error, 
    className = '', 
    placeholder, 
    id,
    ...props 
}, ref) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label 
                    htmlFor={id} 
                    className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                ref={ref}
                placeholder={placeholder}
                className={`w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-md text-sm text-black placeholder:text-slate-500 focus:outline-none transition-all duration-200
                    ${error 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                        : 'border-gray-100 focus:border-[#41431B] focus:ring-1 focus:ring-[#41431B]/20'
                    } ${className}`}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-400 font-medium">
                    {error.message || error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;