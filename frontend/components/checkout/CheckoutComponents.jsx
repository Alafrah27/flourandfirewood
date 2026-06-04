import React from "react";
import { CreditCard, Lock } from "lucide-react";
import Navbar from "../navbar";
import { currencyFormate } from "../../utils/currencyformate";

// ─── Loading Skeleton View ───────────────────────────────────────────────────
export const CheckoutLoadingSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 flex-grow max-w-2xl">
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </main>
    </div>
  );
};

// ─── Order Summary Component ───────────────────────────────────────────────────
export const CheckoutOrderSummary = ({ cart, subtotal }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
        <CreditCard size={16} className="text-[#41431B]" />
        Order Summary
      </h2>

      <div className="space-y-3 border-b border-slate-100 pb-4 mb-4">
        {cart?.products?.map((item, idx) => {
          const product = item.product;
          const productName = product?.productName || "Menu Item";
          const productPrice = product?.productPrice || item.price;
          const sidesTotal = (item.sides || []).reduce(
            (s, side) => s + side.side_price,
            0,
          );
          const lineTotal = (productPrice + sidesTotal) * item.quantity;

          return (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <div className="flex-1 min-w-0">
                <span className="text-slate-700 font-semibold truncate block">
                  {productName}
                  <span className="text-slate-400 font-normal">
                    {" "}
                    × {item.quantity}
                  </span>
                </span>
                {item.sides?.length > 0 && (
                  <span className="text-[10px] text-slate-400">
                    + {item.sides.map((s) => s.side_name).join(", ")}
                  </span>
                )}
              </div>
              <span className="text-slate-800 font-bold ml-4 flex-shrink-0">
                {currencyFormate(lineTotal)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-800">Total</span>
        <span className="text-xl font-extrabold text-[#41431B]">
          {currencyFormate(subtotal)}
        </span>
      </div>
    </div>
  );
};

// ─── Moyasar Payment Form Container ───────────────────────────────────────────
export const CheckoutPaymentForm = ({ formRef, moyasarLoaded }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2">
        <Lock size={16} className="text-[#41431B]" />
        Payment Details
      </h2>

      {/* Moyasar mounts here */}
      <div ref={formRef} className="mysr-form" />

      {!moyasarLoaded && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-3 border-[#41431B]/20 border-t-[#41431B] rounded-full animate-spin" />
          <span className="ml-3 text-sm text-slate-500 font-medium">
            Loading payment form...
          </span>
        </div>
      )}
    </div>
  );
};
