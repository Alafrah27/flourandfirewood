"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar";
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "../../../services/cartQuery";
import {
  CartLoadingSkeleton,
  CartAuthGuard,
  CartErrorState,
  CartEmptyState,
} from "../../../components/cart/CartStates";
import CartItem from "../../../components/cart/CartItem";
import OrderSummarySidebar from "../../../components/cart/OrderSummarySidebar";

export default function CartPage() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { data: cart, isLoading: isCartLoading, error } = useGetCart();
  const { mutateAsync: updateCartItem } = useUpdateCartItem();
  const { mutateAsync: removeFromCart } = useRemoveFromCart();
  const { mutateAsync: clearCart } = useClearCart();
  const router = useRouter();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  // ─── Event Handlers ─────────────────────────────────────────────────────────

  const handleQuantityChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    const toastId = toast.loading("Updating cart quantity...");
    try {
      await updateCartItem({ productId, quantity: newQty });
      toast.update(toastId, {
        render: newQty <= 0 ? "Item removed from cart" : "Cart updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || "Failed to update quantity",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    const toastId = toast.loading("Removing item...");
    try {
      await removeFromCart(productId);
      toast.update(toastId, {
        render: "Item removed from cart",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || "Failed to remove item",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    const toastId = toast.loading("Clearing cart...");
    try {
      await clearCart();
      toast.update(toastId, {
        render: "Cart cleared",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || "Failed to clear cart",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === "HEARTH15") {
      setDiscountPercent(15);
      setPromoApplied(true);
      toast.success("15% Promo discount applied!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // ─── Pricing Calculations ───────────────────────────────────────────────────

  const subtotal = cart?.totalPrice || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = subtotal > 0 ? (subtotal > 45 ? 0 : 5.99) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  // ─── Conditional Rendering of States ────────────────────────────────────────

  if (!isAuthLoaded || (isSignedIn && isCartLoading)) {
    return <CartLoadingSkeleton />;
  }

  if (!isSignedIn) {
    return <CartAuthGuard />;
  }

  if (error) {
    return <CartErrorState error={error} />;
  }

  if (!cart?.products || cart.products.length === 0) {
    return <CartEmptyState />;
  }

  // ─── Normal Populated Cart View ─────────────────────────────────────────────

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-12 flex-grow max-w-6xl">
        {/* Title & Clear Cart Option */}
        <div className="flex flex-row items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Your Hearth Cart
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              {cart.products.reduce((acc, item) => acc + item.quantity, 0)} Items Selected
            </p>
          </div>

          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            Clear Cart
          </button>
        </div>

        {/* Cart Contents Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.products.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <OrderSummarySidebar
              subtotal={subtotal}
              discountPercent={discountPercent}
              discountAmount={discountAmount}
              deliveryFee={deliveryFee}
              total={total}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              promoApplied={promoApplied}
              onApplyPromoCode={applyPromoCode}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}