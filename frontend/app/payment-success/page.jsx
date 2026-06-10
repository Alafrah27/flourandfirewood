"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Navbar from "../../components/navbar";
import { useVerifyPayment } from "../../services/cartQuery";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { mutateAsync: verifyPayment } = useVerifyPayment();

  const [status, setStatus] = useState("loading"); // loading | success | failed | error
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const verifyAttempted = useRef(false);

  const paymentId = searchParams.get("id");
  const paymentStatus = searchParams.get("status");
  const isMobile = searchParams.get("source") === "mobile";

  useEffect(() => {
    if (!isAuthLoaded || !isSignedIn || verifyAttempted.current) return;

    // If Moyasar says it failed on the redirect, show failure immediately
    if (paymentStatus && paymentStatus !== "paid") {
      setStatus("failed");
      setErrorMessage(
        paymentStatus === "failed"
          ? "Your payment was declined. Please try again."
          : `Payment status: ${paymentStatus}`,
      );
      return;
    }

    if (!paymentId) {
      setStatus("error");
      setErrorMessage("No payment ID found. Please return to your cart.");
      return;
    }

    // Verify with our backend
    verifyAttempted.current = true;

    const verify = async () => {
      try {
        const result = await verifyPayment(paymentId);
        setOrderData(result.order);
        setStatus("success");

        // If opened from mobile app, redirect back to Expo via deep link
        if (isMobile && result.order?._id) {
          window.location.href = `flourandfirewood://payment-success?orderId=${result.order._id}`;
          return;
        }
      } catch (err) {
        setStatus("failed");
        setErrorMessage(
          err.message || "Payment verification failed. Please contact support.",
        );
      }
    };

    verify();
  }, [isAuthLoaded, isSignedIn, paymentId, paymentStatus, verifyPayment, isMobile]);

  // ─── Loading ──────────────────────────────────────────────────────────────────
  if (!isAuthLoaded || status === "loading") {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-[#41431B]/10 animate-ping" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#41431B]/5">
                <Loader2
                  size={36}
                  className="text-[#41431B] animate-spin"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Verifying Payment
              </h2>
              <p className="text-sm text-slate-500 font-light mt-1">
                Please wait while we confirm your order...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Animated Check */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-pulse" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200">
                <CheckCircle
                  size={48}
                  className="text-emerald-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Text */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Order Confirmed!
              </h1>
              <p className="text-slate-500 text-sm font-light mt-2 leading-relaxed max-w-sm mx-auto">
                Your payment has been processed successfully. Your delicious
                meal is being prepared!
              </p>
            </div>

            {/* Order Details Card */}
            {orderData && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-left space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Order ID</span>
                  <span className="font-mono font-semibold text-slate-700">
                    #{orderData._id?.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Items</span>
                  <span className="font-semibold text-slate-700">
                    {orderData.items?.length || 0} item(s)
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Paid
                  </span>
                </div>
                <div className="flex justify-between text-xs border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-700">Total Paid</span>
                  <span className="font-extrabold text-[#41431B]">
                    {new Intl.NumberFormat("ar-SA", {
                      style: "currency",
                      currency: "SAR",
                    }).format(orderData.totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/menu"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md hover:shadow-lg shadow-[#41431B]/15 transition-all duration-300 hover:scale-[1.01] text-sm"
              >
                <ShoppingBag size={16} />
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Failed / Error ───────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Animated X */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-rose-100 animate-pulse" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 border-2 border-rose-200">
              {status === "error" ? (
                <AlertTriangle
                  size={48}
                  className="text-amber-500"
                  strokeWidth={1.5}
                />
              ) : (
                <XCircle
                  size={48}
                  className="text-rose-500"
                  strokeWidth={1.5}
                />
              )}
            </div>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {status === "error" ? "Something Went Wrong" : "Payment Failed"}
            </h1>
            <p className="text-slate-500 text-sm font-light mt-2 leading-relaxed max-w-sm mx-auto">
              {errorMessage}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#41431B] hover:bg-[#515422] text-white font-bold rounded-2xl shadow-md hover:shadow-lg shadow-[#41431B]/15 transition-all duration-300 hover:scale-[1.01] text-sm"
            >
              Return to Cart
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}