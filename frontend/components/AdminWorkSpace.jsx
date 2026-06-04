"use client";

import DasboardNavbar from "./dasboardNavbar";
import Sidebar from "./sidebar";
import { useState, Suspense } from "react";

export default function AdminWorkSpace({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
        <section className="flex h-screen w-full bg-slate-900">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            
            <main className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-72'}`}>
                <Suspense fallback={<div className="h-[65px] w-full bg-slate-950/80 border-b border-white/10" />}>
                    <DasboardNavbar />
                </Suspense>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </section>
    );
}