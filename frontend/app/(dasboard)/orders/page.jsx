"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Receipt,
  User,
  Mail,
  Calendar,
  X,
  ChevronRight,
  TrendingUp,
  XCircle,
  Clock,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useGetAdminOrders, useDeleteOrder } from "../../../services/cartQuery";
import { currencyFormate } from "../../../utils/currencyformate";
import { toast } from "react-toastify";
import ActionMenu from "../../../components/ActionMenu";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function AdminOrdersPage() {
  const { data: orders, isLoading: isOrdersLoading, error } = useGetAdminOrders();
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQueryURL = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchQueryURL);
  const [prevSearchQueryURL, setPrevSearchQueryURL] = useState(searchQueryURL);

  // Sync state with URL parameter changes
  if (searchQueryURL !== prevSearchQueryURL) {
    setSearchTerm(searchQueryURL);
    setPrevSearchQueryURL(searchQueryURL);
  }

  const updateURL = (newParams) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  // Debounce search input and update URL
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== searchQueryURL) {
        updateURL({ search: searchTerm });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, searchQueryURL]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleDeleteOrder = async (orderId) => {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      const loadingToast = toast.loading("Deleting order...");
      try {
        await deleteOrder(orderId);
        toast.update(loadingToast, {
          render: "Order deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Delete order failed:", err);
        toast.update(loadingToast, {
          render: err.message || "Failed to delete order",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  // ─── Find Selected Order details ───────────────────────────────────────────
  const selectedOrder = orders?.find((o) => o._id === selectedOrderId);

  // ─── Calculations for Stats Cards ──────────────────────────────────────────
  const totalSales = orders
    ?.filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.totalPrice, 0) || 0;

  const paidOrdersCount = orders?.filter((o) => o.status === "paid").length || 0;
  const pendingOrdersCount = orders?.filter((o) => o.status === "pending").length || 0;
  const failedOrdersCount = orders?.filter((o) => o.status === "failed").length || 0;

  // ─── Filter & Search Logic ──────────────────────────────────────────────────
  const filteredOrders = orders?.filter((order) => {
    // Filter by status
    if (statusFilter !== "all" && order.status?.toLowerCase() !== statusFilter) {
      return false;
    }
    // Search by ID, customer name, email, or item names
    const searchLower = searchTerm.toLowerCase();
    const orderIdMatch = order._id.toLowerCase().includes(searchLower);
    const userMatch =
      order.user?.fullname?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower);
    const itemMatch = order.items.some((i) =>
      i.productName.toLowerCase().includes(searchLower)
    );
    return orderIdMatch || userMatch || itemMatch;
  }) || [];

  // ─── Status Badge Component ─────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Paid
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  // ─── Loading / Error templates ──────────────────────────────────────────────
  if (isOrdersLoading) {
    return (
      <div className="p-8 space-y-6 w-full max-w-7xl mx-auto">
        <div className="h-8 bg-white/5 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="bg-[#12130c]/95 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="h-16 w-16 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20">
            <XCircle size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Connection Failed</h2>
            <p className="text-slate-400 text-sm font-light">
              {error.message || "An error occurred while fetching orders data."}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#41431B] hover:bg-[#515422] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-8 pt-10 flex flex-col min-h-screen">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Orders Management</h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor transactions, check receipts, and inspect customer purchases
        </p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales</span>
            <span className="text-base font-extrabold text-[#D9C4A0]">{currencyFormate(totalSales)}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paid Orders</span>
            <span className="text-base font-extrabold text-white">{paidOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
            <span className="text-base font-extrabold text-white">{pendingOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <XCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Failed</span>
            <span className="text-base font-extrabold text-white">{failedOrdersCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
        {/* Search */}
        <div className="relative w-full xl:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ID, customer, email, or item..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#41431B]/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center flex-wrap">
          <SlidersHorizontal size={14} className="text-slate-500 mr-1" />
          {[
            { value: "all", label: "All Statuses" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                ${statusFilter === tab.value
                  ? "bg-[#41431B] text-white border-[#41431B] font-bold"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table view */}
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm font-light text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300 font-semibold text-xs tracking-wider uppercase">
                <th className="p-4 text-start font-bold">Order ID</th>
                <th className="p-4 text-start font-bold">Customer</th>
                <th className="p-4 text-start font-bold">Purchased Items</th>
                <th className="p-4 text-end font-bold">Total Price</th>
                <th className="p-4 text-center font-bold">Status</th>
                <th className="p-4 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-light">
                    No orders match the search or filter settings.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-all text-slate-200 group">
                    <td className="p-4 text-start font-mono font-semibold text-white text-xs">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4 text-start">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">
                          {order.user?.fullname || "Anonymous User"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {order.user?.email || "No Email"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-start">
                      <div className="max-w-[200px] sm:max-w-xs truncate font-medium text-slate-200 text-sm">
                        {order.items.map((i) => `${i.productName} × ${i.quantity}`).join(", ")}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-4 text-end text-[#D9C4A0] font-extrabold">
                      {currencyFormate(order.totalPrice)}
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <ActionMenu
                          actions={[
                            {
                              label: "Inspect",
                              icon: Receipt,
                              onClick: () => setSelectedOrderId(order._id),
                            },
                            {
                              label: "Delete",
                              icon: Trash2,
                              onClick: () => handleDeleteOrder(order._id),
                              danger: true,
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Slide-over Details Drawer ────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedOrderId(null)}
          />

          {/* Panel Sheet */}
          <div className="relative w-full max-w-md h-full bg-white border-l border-slate-100 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#A2A657] uppercase tracking-wider block">
                  Order Details
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

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Status Section */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-700">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payment Status
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Customer details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-[#A2A657] uppercase tracking-wider">
                  Customer Profile
                </h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      {selectedOrder.user?.fullname || "Anonymous User"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    <span className="font-mono text-slate-500 text-xs truncate block max-w-[280px]">
                      {selectedOrder.user?.email || "No Email Address"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[#A2A657] uppercase tracking-wider">
                  Purchased Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const sidesTotal = (item.sides || []).reduce((s, side) => s + side.side_price, 0);
                    const lineSubtotal = (item.price + sidesTotal) * item.quantity;

                    return (
                      <div key={idx} className="flex justify-between items-start text-sm text-slate-600">
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

              {/* Transaction Metadata */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-[#A2A657] uppercase tracking-wider">
                  Transaction Metadata
                </h4>
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Order Creation Date</span>
                    <span className="font-semibold text-slate-600">
                      {new Date(selectedOrder.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moyasar Payment ID</span>
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
                <span className="text-sm font-bold text-slate-800">Total Price</span>
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