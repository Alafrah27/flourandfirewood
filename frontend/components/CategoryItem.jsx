import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import ImageKit from './ImageKIt';

export const CategoryItem = ({ category, onEdit, onDelete }) => {
  const bgStyle = {
    backgroundColor: category.backgroundColor || "rgba(255, 255, 255, 0.05)"
  };

  return (
    <div
      style={bgStyle}
      className="group relative flex flex-col items-center justify-between p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      {/* Image container */}
      <div className="w-29 h-29  rounded-full overflow-hidden   flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
        <ImageKit
          src={category.imageUrl}
          alt={category.categoryName}
          width={96}
          height={96}
          transformation={[{ width: "96", height: "96", cropMode: "fo-auto" }]}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Category name */}
      <h3 className="text-sm font-semibold text-white tracking-wide truncate max-w-full text-center">
        {category.categoryName}
      </h3>

      {/* Actions container (shows on hover) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
          className="p-2 bg-white/10 hover:bg-white/25 text-white rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
          title="Edit Category"
        >
          <Edit size={14} />
        </button>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category);
          }}
          className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
          title="Delete Category"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;
