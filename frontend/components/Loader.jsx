import React from 'react';

export const Loader = ({ className = "" }) => {
  return (
    <div className={`flex justify-center items-center py-20 text-white/60 ${className}`}>
      <div className="relative w-10 h-10">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#A2A657]/20"></div>
        {/* Spinning indicator */}
        <div className="absolute inset-0 rounded-full border-4 border-t-[#A2A657] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
