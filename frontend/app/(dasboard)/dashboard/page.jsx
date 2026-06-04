"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  BarChart3,
  DollarSign,
  ArrowRight,
  TrendingDown,
  Calendar,
  Pizza,
} from "lucide-react";
import { useGetDashboardStats } from "../../../services/cartQuery";
import { currencyFormate } from "../../../utils/currencyformate";

export default function DashboardOverviewPage() {
  const { data: stats, isLoading: isStatsLoading, error } = useGetDashboardStats();
  const [activeHoverPoint, setActiveHoverPoint] = useState(null);

  // ─── Loading / Error states ────────────────────────────────────────────────
  if (isStatsLoading) {
    return (
      <div className="p-8 space-y-6 w-full max-w-7xl mx-auto w-full px-8 pt-10 flex flex-col min-h-screen">
        <div className="h-8 bg-white/5 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
          <div className="h-[350px] bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="bg-[#12130c]/95 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="h-16 w-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto">
            <TrendingDown size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Connection Error</h2>
            <p className="text-slate-400 text-sm font-light">
              {error.message || "An error occurred while loading dashboard statistics."}
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

  const { summary, dailyRevenue = [], bestSelling = [], categoryStats = [] } = stats || {};

  // ─── Custom SVG Line Chart Coordinates ─────────────────────────────────────
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 50;
  const paddingY = 40;

  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 100);

  const points = dailyRevenue.map((d, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (dailyRevenue.length - 1);
    const y = chartHeight - paddingY - (d.revenue * (chartHeight - paddingY * 2)) / maxRevenue;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0 ? `
    ${linePath}
    L ${points[points.length - 1].x} ${chartHeight - paddingY}
    L ${points[0].x} ${chartHeight - paddingY}
    Z
  ` : "";

  // ─── Best Selling Max Quantities ───────────────────────────────────────────
  const maxSales = Math.max(...bestSelling.map((p) => p.salesCount), 1);

  return (
    <div className="w-full px-8 pt-10 flex flex-col min-h-screen space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard Analytics</h1>
        <p className="text-slate-400 text-xs mt-1">
          Flour & Wood Oven Restaurant real-time sales and operation overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Revenue</span>
            <span className="text-lg font-black text-[#D9C4A0]">{currencyFormate(summary?.totalSales)}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-lg font-black text-white">{summary?.ordersCount}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#A2A657]/10 text-[#A2A657] border border-[#A2A657]/20 flex items-center justify-center flex-shrink-0">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Customers</span>
            <span className="text-lg font-black text-white">{summary?.activeCustomers}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Order Value</span>
            <span className="text-lg font-black text-white">{currencyFormate(summary?.aov)}</span>
          </div>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left: Custom SVG Sales Line Chart */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Trend</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Oven-fired sales over the last 7 days</p>
            </div>
            {activeHoverPoint ? (
              <div className="bg-[#12130c]/90 border border-white/10 rounded-xl px-3 py-1 text-right text-xs">
                <span className="text-slate-400 font-medium block">{activeHoverPoint.date}</span>
                <span className="text-[#D9C4A0] font-bold">{currencyFormate(activeHoverPoint.revenue)}</span>
              </div>
            ) : (
              <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <Calendar size={12} /> Live Sync
              </span>
            )}
          </div>

          {/* SVG Line Chart Wrapper */}
          <div className="relative w-full overflow-hidden flex-grow flex items-center justify-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
              {/* Gradients */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A2A657" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#A2A657" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = paddingY + ratio * (chartHeight - paddingY * 2);
                const gridVal = maxRevenue * (1 - ratio);
                return (
                  <g key={ratio} className="opacity-30">
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#ffffff"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize={10}
                      className="text-right"
                      textAnchor="end"
                    >
                      {Math.round(gridVal)}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fill under the line */}
              {areaPath && (
                <path d={areaPath} fill="url(#chartGradient)" className="transition-all duration-300" />
              )}

              {/* Chart Line Path */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#A2A657"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Scatter Points / Interactive Nodes */}
              {points.map((p, idx) => (
                <g
                  key={idx}
                  onMouseEnter={() => setActiveHoverPoint(p)}
                  onMouseLeave={() => setActiveHoverPoint(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activeHoverPoint?.date === p.date ? 6 : 4}
                    fill={activeHoverPoint?.date === p.date ? "#ffffff" : "#A2A657"}
                    stroke="#12130c"
                    strokeWidth={2}
                    className="transition-all duration-150"
                  />
                  {/* Invisible larger hover node for easy cursor tracking */}
                  <circle cx={p.x} cy={p.y} r={16} fill="transparent" />

                  {/* X Axis Labels */}
                  <text
                    x={p.x}
                    y={chartHeight - 12}
                    fill="#94a3b8"
                    fontSize={10}
                    textAnchor="middle"
                    fontWeight="semibold"
                  >
                    {p.date.split(" ")[1]}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Best Selling Products (Interactive Bars) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white">Top Artisan Menu Items</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Highest order volume catalog item rankings</p>
          </div>

          <div className="space-y-5 flex-grow flex flex-col justify-center">
            {bestSelling.map((item, idx) => {
              const widthPercent = (item.salesCount / maxSales) * 100;
              return (
                <div key={item._id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200 block truncate max-w-[180px]">{item.name}</span>
                    <span className="text-slate-400">{item.salesCount} sold</span>
                  </div>
                  {/* Slider Bar */}
                  <div className="w-full h-2.5 bg-white/5 border border-white/5 rounded-full overflow-hidden relative">
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className="h-full bg-gradient-to-r from-[#41431B] to-[#A2A657] rounded-full transition-all duration-500 ease-out"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Lower section details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Shares */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white">Category Distribution</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Revenue contributions grouped by product category</p>
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => {
              const totalCategoryRevenue = categoryStats.reduce((sum, c) => sum + c.revenue, 0);
              const percent = totalCategoryRevenue > 0 ? (item.revenue / totalCategoryRevenue) * 100 : 0;
              return (
                <div key={item._id} className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Pizza size={14} className="text-[#A2A657]" />
                      {item._id || "Uncategorized"}
                    </span>
                    <span className="font-extrabold text-[#D9C4A0]">
                      {currencyFormate(item.revenue)}
                    </span>
                  </div>
                  {/* Percentage Indicator */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.salesCount} items sold</span>
                    <span>{Math.round(percent)}% Share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Latest Order Quick Links */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Operational Insights</h3>
                <p className="text-slate-400 text-[10px] mt-0.5">Quick summaries of restaurant status and orders</p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-bold text-[#A2A657] hover:text-[#b4b868] flex items-center gap-1 bg-[#A2A657]/10 px-3 py-1.5 rounded-xl transition-all"
              >
                Go to Orders <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Ticket Size</span>
                <p className="text-lg font-black text-[#D9C4A0] mt-1">{currencyFormate(summary?.aov)}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Average spend per customer. Promote upselling (extra sides, custom beverages) to increase target metrics.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sales Volume Ratio</span>
                <p className="text-lg font-black text-white mt-1">{summary?.ordersCount} Bills</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Calculated transaction volume. Match against menu items lists to align daily kitchen prep schedules.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase border-t border-white/5 pt-4 text-center mt-6">
            Flour & Wood Oven Restaurant System · Dashboard Live Data Sync
          </div>
        </div>
      </div>
    </div>
  );
}