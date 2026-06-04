import React from "react";
import { Ticket, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { currencyFormate } from "../../utils/currencyformate";

export default function OrderSummarySidebar({
  subtotal,
  discountPercent,
  discountAmount,
  deliveryFee,
  total,
  promoCode,
  setPromoCode,
  promoApplied,
  onApplyPromoCode,
  onCheckout,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">
        Order Summary
      </h3>

      {/* Promo Code Input */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Have a Promo Code?
        </label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Ticket
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code (HEARTH15)"
              disabled={promoApplied}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#41431B]/50 transition-all disabled:opacity-60"
            />
          </div>
          <button
            type="button"
            onClick={onApplyPromoCode}
            disabled={promoApplied}
            className="px-4 py-2 bg-[#41431B]/5 hover:bg-[#41431B] text-[#41431B] hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <Sparkles size={10} /> HEARTH15 Applied (15% Off)
          </p>
        )}
      </div>

      {/* Price lines */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Subtotal</span>
          <span className="font-semibold">{currencyFormate(subtotal)}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between text-xs text-emerald-500 font-medium">
            <span>Promo discount</span>
            <span>-{currencyFormate(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-slate-500">
          <span>Delivery</span>
          <span className="font-semibold">
            {deliveryFee === 0 ? (
              <span className="text-emerald-500 font-medium">FREE</span>
            ) : (
              currencyFormate(deliveryFee)
            )}
          </span>
        </div>

        {deliveryFee > 0 && (
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            Add <span className="font-bold text-[#41431B]">{currencyFormate(Math.max(0, 45 - subtotal))}</span> more to unlock <span className="font-bold text-emerald-500">FREE delivery</span>!
          </p>
        )}
      </div>

      {/* Total price */}
      <div className="flex justify-between items-end pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl font-extrabold text-[#41431B]">
            {currencyFormate(total)}
          </p>
        </div>
      </div>

      {/* Checkout action */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={onCheckout}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md hover:shadow-lg shadow-[#41431B]/15 hover:shadow-[#41431B]/25 transition-all duration-300 hover:scale-[1.01] cursor-pointer text-sm"
        >
          Proceed to Payment
          <ArrowRight size={16} />
        </button>

        {/* Security info */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
          <ShieldCheck size={14} className="text-emerald-500" />
          Secure Checkout Guarantee
        </div>
      </div>
    </div>
  );
}
