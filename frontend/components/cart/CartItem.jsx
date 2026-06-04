import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import ImageKit from "../ImageKIt";
import { currencyFormate } from "../../utils/currencyformate";

export default function CartItem({ item, onQuantityChange, onRemoveItem }) {
  const product = item.product;
  const productPrice = product?.productPrice || item.price;
  const productName = product?.productName || "Dish Option";
  const sidesTotal = (item.sides || []).reduce((s, side) => s + side.side_price, 0);
  const itemSubtotal = (productPrice + sidesTotal) * item.quantity;

  return (
    <div className="flex flex-row items-center gap-3 sm:gap-5 p-4 sm:p-5 bg-white border border-slate-100 rounded-3xl hover:shadow-sm transition-all duration-300 relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Product Image */}
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center relative">
        {product?.productImage ? (
          <ImageKit
            src={product.productImage}
            alt={productName}
            width={80}
            height={80}
            transformation={[
              { height: 160, width: 160, cropMode: "fo-auto" },
              { quality: "auto" },
            ]}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[10px] text-slate-400">Meal</span>
        )}
      </div>

      {/* Product Name, Sides & Unit Price */}
      <div className="flex-grow min-w-0 text-left space-y-0.5 sm:space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug line-clamp-1">
          {productName}
        </h3>

        {/* Selected Sides Tags */}
        {item.sides && item.sides.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {item.sides.map((side) => (
              <span
                key={side.side_name}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#41431B]/5 text-[#41431B] text-[8px] sm:text-[9px] font-bold rounded-md leading-tight"
              >
                + {side.side_name}
                <span className="text-[#41431B]/60">({currencyFormate(side.side_price)})</span>
              </span>
            ))}
          </div>
        )}

        <p className="text-slate-400 text-[10px] sm:text-xs font-semibold">
          Unit: {currencyFormate(productPrice)}
          {sidesTotal > 0 ? ` + ${currencyFormate(sidesTotal)} sides` : ""}
        </p>
      </div>

      {/* Quantity and Subtotal Actions Stack */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 flex-shrink-0">
        {/* Quantity adjustment controls */}
        <div className="flex items-center border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm h-8 sm:h-10">
          <button
            type="button"
            onClick={() => onQuantityChange(product?._id, item.quantity, -1)}
            className="px-2 sm:px-3 hover:bg-slate-50 text-slate-500 font-bold transition-colors cursor-pointer text-xs sm:text-sm"
          >
            <Minus size={10} />
          </button>
          <span className="px-2 sm:px-4 font-bold text-slate-800 text-[10px] sm:text-xs">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(product?._id, item.quantity, 1)}
            className="px-2 sm:px-3 hover:bg-slate-50 text-slate-500 font-bold transition-colors cursor-pointer text-xs sm:text-sm"
          >
            <Plus size={10} />
          </button>
        </div>

        {/* Subtotal & Delete */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-base font-extrabold text-[#41431B] whitespace-nowrap">
            {currencyFormate(itemSubtotal)}
          </span>

          <button
            type="button"
            onClick={() => onRemoveItem(product?._id)}
            className="p-1.5 sm:p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all cursor-pointer"
            title="Remove product"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
