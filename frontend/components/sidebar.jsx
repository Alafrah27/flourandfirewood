"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
    LayoutDashboard,
    ShoppingCart,
    FileText,
    UtensilsCrossed,
    Tags,
    Table2,
    CalendarDays,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronRight
} from 'lucide-react';

const NavItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        link: "/dashboard"
    },
   
    {
        title: "Orders",
        icon: FileText,
        link: "/orders"
    },
    {
        title: "Menu Management",
        icon: UtensilsCrossed,
        link: "/product"
    },
    {
        title: "Categories",
        icon: Tags,
        link: "/categories"
    },
    {
        title: "Tables",
        icon: Table2,
        link: "/tables"
    },
    // {
    //     title: "Reservations",
    //     icon: CalendarDays,
    //     link: "/reservations"
    // },
    {
        title: "Customers",
        icon: Users,
        link: "/customers"
    },
];

function Sidebar({ collapsed, onToggle }) {
    const pathname = usePathname();
    const { user } = useUser();
    const { signOut } = useClerk();

    const userInitials = user?.firstName
        ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase()
        : 'AD';
    const userName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Staff Member';
    const userRole = user?.publicMetadata?.role || user?.privateMetadata?.role || 'admin';

    return (
        <aside className={`fixed top-0 left-0 h-screen bg-slate-950 border-r border-white/10 flex flex-col transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-72'}`}>

            {/* Header: Logo & Collapse Toggle */}
            <div className={`flex items-center h-[65px] border-b border-white/10 ${collapsed ? 'px-4 justify-center' : 'px-6 justify-between'}`}>
                {!collapsed && (
                    <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1">
                        F&<span className="text-[#A2A657]">F</span>
                        <span className="text-slate-400 font-normal text-sm ml-1.5">Admin</span>
                    </h1>
                )}
                <button
                    onClick={onToggle}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
                {!collapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">Main Menu</p>
                )}
                <ul className="space-y-1">
                    {NavItems.map((item, index) => {
                        const isActive = pathname === item.link;
                        return (
                            <li key={index}>
                                <Link
                                    href={item.link}
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                                        ${collapsed ? 'justify-center' : ''}
                                        ${isActive
                                            ? 'bg-[#41431B]/20 text-[#A2A657]'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                    title={collapsed ? item.title : ''}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#A2A657] rounded-r-full" />
                                    )}
                                    <item.icon
                                        size={20}
                                        className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#A2A657]' : 'text-slate-500 group-hover:text-white'}`}
                                    />
                                    {!collapsed && (
                                        <>
                                            <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                                {item.title}
                                            </span>
                                            {isActive && (
                                                <ChevronRight size={14} className="ml-auto text-[#A2A657]" />
                                            )}
                                        </>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Actions Section */}
            <div className={`border-t border-white/10 ${collapsed ? 'p-2' : 'p-3'}`}>
                {!collapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-2">Support</p>
                )}
                <div className="space-y-0.5">
                    <Link
                        href="/settings"
                        className={`w-full flex items-center gap-3 py-2.5 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-all text-sm font-medium ${collapsed ? 'justify-center px-2' : 'px-3'}`}
                        title={collapsed ? 'Settings' : ''}
                    >
                        <Settings size={18} className="flex-shrink-0" />
                        {!collapsed && <span>Settings</span>}
                    </Link>

                   

                    <button
                        onClick={() => signOut({ redirectUrl: '/' })}
                        className={`w-full flex items-center gap-3 py-2.5 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all text-sm font-medium ${collapsed ? 'justify-center px-2' : 'px-3'} cursor-pointer`}
                        title={collapsed ? 'Log out' : ''}
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {!collapsed && <span>Log out</span>}
                    </button>
                </div>
            </div>

            {/* User Profile Footer */}
            <div className={`border-t border-white/10 ${collapsed ? 'p-3' : 'px-4 py-3'}`}>
                {!collapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            {user?.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt={userName}
                                    width={36}
                                    height={36}
                                    className="rounded-full object-cover ring-2 ring-white/10"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#41431B] to-[#2B2D11] flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                                    {userInitials}
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-950 rounded-full" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{userName}</p>
                            <p className="text-[11px] text-slate-500 truncate capitalize">{userRole}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="relative">
                            {user?.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt={userName}
                                    width={36}
                                    height={36}
                                    className="rounded-full object-cover ring-2 ring-white/10"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#41431B] to-[#2B2D11] flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10" title={userName}>
                                    {userInitials}
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-950 rounded-full" />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
