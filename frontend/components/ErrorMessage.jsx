import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 mt-6 shadow-lg shadow-red-950/20 backdrop-blur-sm ${className}`}>
      <AlertCircle size={20} className="flex-shrink-0 animate-bounce" />
      <span className="text-sm font-medium tracking-wide">
        {message || "An unexpected error occurred. Please try again."}
      </span>
    </div>
  );
};

export default ErrorMessage;
