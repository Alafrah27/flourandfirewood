"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, SignInButton } from "@clerk/nextjs";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Receipt,
  X,
  ChevronRight,
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Navbar from "../../../components/navbar";
import { useGetOrders } from "../../../services/cartQuery";
import { currencyFormate } from "../../../utils/currencyformate";

export default function MyOrdersPage() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { data: orders, isLoading: isOrdersLoading, error } = useGetOrders();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Find currently selected order object
  const selectedOrder = orders?.find((o) => o._id === selectedOrderId);

  // ─── Status Badge Builder ───────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Paid
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full uppercase tracking-wider">
            <XCircle size={12} className="text-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full uppercase tracking-wider">
            <Clock size={12} className="text-amber-500" />
            Pending
          </span>
        );
    }
  };

  // ─── Loading Skeleton ───────────────────────────────────────────────────────
  if (!isAuthLoaded || (isSignedIn && isOrdersLoading)) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 flex-grow max-w-4xl space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/4 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ─── Auth Guard State ────────────────────────────────────────────────────────
  if (!isSignedIn) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center max-w-lg">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm text-center w-full space-y-6">
            <div className="h-16 w-16 bg-[#41431B]/5 text-[#41431B] rounded-3xl flex items-center justify-center mx-auto">
              <ShoppingBag size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                View Your Orders
              </h2>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                Please log in to review your order history, check payment receipts, and track details.
              </p>
            </div>
            <SignInButton mode="modal">
              <button className="w-full py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer text-sm">
                Sign In to View Orders
              </button>
            </SignInButton>
          </div>
        </main>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center max-w-lg">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center w-full space-y-6">
            <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
              <XCircle size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">
                Failed to Load Orders
              </h2>
              <p className="text-slate-500 text-sm font-light">
                {error.message || "An unexpected connection issue occurred."}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#41431B] hover:bg-[#515422] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ─── Empty State ────────────────────────────────────────────────────────────
  if (!orders || orders.length === 0) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center max-w-md">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm text-center w-full space-y-6">
            <div className="h-16 w-16 bg-[#41431B]/5 text-[#41431B] rounded-3xl flex items-center justify-center mx-auto">
              <Receipt size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">
                No Orders Placed Yet
              </h2>
              <p className="text-slate-500 text-sm font-light">
                You haven&apos;t placed any wood-fired orders on this account yet. Time to order dinner!
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex w-full items-center justify-center gap-2 py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer text-sm"
            >
              Explore Menu Catalog
              <ChevronRight size={16} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col relative">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-12 flex-grow max-w-4xl">
        {/* Title */}
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Order History
          </h1>
          <p className="text-slate-500 text-sm font-light mt-1">
            Review and track all your transactions and meals
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );

            return (
              <div
                key={order._id}
                onClick={() => setSelectedOrderId(order._id)}
                className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#41431B]/5 group-hover:text-[#41431B] transition-colors">
                    <Receipt size={22} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Order ID #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                      {order.items.map((i) => i.productName).join(", ")}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formattedDate}
                      </span>
                      <span>•</span>
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} Item(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-50 sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Amount
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-[#41431B]">
                      {currencyFormate(order.totalPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <ChevronRight
                      size={18}
                      className="text-slate-400 group-hover:translate-x-0.5 transition-transform hidden sm:block"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── Slide-over Side Drawer (Details Panel) ─────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedOrderId(null)}
          />

          {/* Panel Sheet */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Transaction Receipt
                </span>
                <h2 className="text-lg font-bold text-slate-800">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Scrollable Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-3xl p-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payment Status
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Items Purchased
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const sidesTotal = (item.sides || []).reduce((s, side) => s + side.side_price, 0);
                    const lineSubtotal = (item.price + sidesTotal) * item.quantity;

                    return (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-800 font-bold leading-tight block">
                            {item.productName}
                            <span className="text-slate-400 font-normal"> × {item.quantity}</span>
                          </span>
                          {item.sides?.length > 0 && (
                            <span className="text-[10px] text-[#A2A657] font-semibold mt-0.5 block">
                              + {item.sides.map((s) => s.side_name).join(", ")}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-800 font-bold ml-4">
                          {currencyFormate(lineSubtotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meta information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Transaction Metadata
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date & Time</span>
                    <span className="font-semibold text-slate-600">
                      {new Date(selectedOrder.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Moyasar Payment ID</span>
                    <span className="font-mono font-semibold text-slate-600 truncate max-w-[180px]" title={selectedOrder.paymentId}>
                      {selectedOrder.paymentId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Total Paid</span>
                <span className="text-xl font-extrabold text-[#41431B]">
                  {currencyFormate(selectedOrder.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
