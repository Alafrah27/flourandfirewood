"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import { useGetCart } from "../../services/cartQuery";
import {
  CheckoutLoadingSkeleton,
  CheckoutOrderSummary,
  CheckoutPaymentForm,
} from "../../components/checkout/CheckoutComponents";

export default function CheckoutPage() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { data: cart, isLoading: isCartLoading } = useGetCart();
  const router = useRouter();
  const formRef = useRef(null);
  const [moyasarLoaded, setMoyasarLoaded] = useState(false);
  const moyasarInitialized = useRef(false);

  const subtotal = cart?.totalPrice || 0;

  // Redirect if not signed in
  useEffect(() => {
    if (isAuthLoaded && !isSignedIn) {
      router.push("/cart");
    }
  }, [isAuthLoaded, isSignedIn, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isCartLoading && cart && (!cart.products || cart.products.length === 0)) {
      router.push("/cart");
    }
  }, [isCartLoading, cart, router]);

  // Load Moyasar script
  useEffect(() => {
    if (typeof window !== "undefined" && window.Moyasar) {
      setMoyasarLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.umd.min.js";
    script.async = true;
    script.onload = () => setMoyasarLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize Moyasar form when script is loaded and cart data is ready
  useEffect(() => {
    if (
      !moyasarLoaded ||
      !cart ||
      !cart.products ||
      cart.products.length === 0 ||
      moyasarInitialized.current
    ) {
      return;
    }

    // Amount in halalas (smallest currency unit)
    const amountInHalalas = Math.round(subtotal * 100);

    if (amountInHalalas <= 0) return;

    // Clear previous form content
    if (formRef.current) {
      formRef.current.innerHTML = "";
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || "pk_test_nCj7vjoxrey849p7srSViHHBiNP7FrSejBJU2NQQ";

      if (!process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY) {
        console.warn(
          "Warning: NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY is not defined in process.env. " +
          "Using fallback key. If you recently updated your .env file, please restart your Next.js dev server."
        );
      }

      console.log("Initializing Moyasar with amount:", amountInHalalas, "halalas");

      window.Moyasar.init({
        element: ".mysr-form",
        amount: amountInHalalas,
        currency: "SAR",
        description: `Restaurant Order - ${cart.products.length} item(s)`,
        publishable_api_key: apiKey,
        callback_url: `${window.location.origin}/payment-success`,
        methods: ["creditcard", "stcpay"],
        supported_networks: ["mada", "visa", "mastercard"],
      });
      moyasarInitialized.current = true;
    } catch (err) {
      console.error("Moyasar init error:", err);
    }
  }, [moyasarLoaded, cart, subtotal]);

  // ─── Loading State ───────────────────────────────────────────────────────────
  if (!isAuthLoaded || isCartLoading) {
    return <CheckoutLoadingSkeleton />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-10 flex-grow max-w-2xl">
        {/* Back to Cart */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#41431B] font-semibold transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Cart
        </Link>

        {/* Checkout Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Checkout
          </h1>
          <p className="text-slate-500 text-sm font-light mt-1">
            Complete your payment to place the order
          </p>
        </div>

        {/* Order Summary Card */}
        <CheckoutOrderSummary cart={cart} subtotal={subtotal} />

        {/* Moyasar Payment Form */}
        <CheckoutPaymentForm formRef={formRef} moyasarLoaded={moyasarLoaded} />

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold tracking-wide uppercase py-4">
          <ShieldCheck size={14} className="text-emerald-500" />
          Secure Payment via Moyasar · SSL Encrypted
        </div>
      </main>
    </div>
  );
}
