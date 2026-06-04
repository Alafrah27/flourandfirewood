"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown } from "lucide-react"
import UserItem from "../../../components/UserItem"
import { useGetUsers, useDeleteUser } from "../../../services/userQuery"
import { toast } from "react-toastify"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export default function CustomersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = parseInt(searchParams.get("page")) || 1;
    const roleFilter = searchParams.get("role") || "";
    const searchQueryURL = searchParams.get("search") || "";

    const [searchQuery, setSearchQuery] = useState(searchQueryURL);
    const [prevSearchQueryURL, setPrevSearchQueryURL] = useState(searchQueryURL);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const roleDropdownRef = useRef(null);

    // Adjust state during render when URL search params change externally
    if (searchQueryURL !== prevSearchQueryURL) {
        setSearchQuery(searchQueryURL);
        setPrevSearchQueryURL(searchQueryURL);
    }

    // Enforce limit=5 in URL immediately on mount/update
    useEffect(() => {
        const currentLimit = searchParams.get("limit");
        if (currentLimit !== "5") {
            const current = new URLSearchParams(searchParams.toString());
            current.set("limit", "5");
            router.replace(`${pathname}?${current.toString()}`);
        }
    }, [searchParams, router, pathname]);

    // Handle click outside to close role dropdown
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
                setIsRoleOpen(false);
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const updateURL = (newParams) => {
        const current = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });
        // Always enforce default limit is 5
        current.set("limit", "5");
        router.push(`${pathname}?${current.toString()}`);
    };

    // Debounce search input and update URL
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== searchQueryURL) {
                updateURL({ search: searchQuery, page: 1 });
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, searchQueryURL]);

    const handleRoleChange = (role) => {
        updateURL({ role, page: 1 });
    };

    const handlePageChange = (newPage) => {
        updateURL({ page: newPage });
    };

    const { data, isLoading, error } = useGetUsers();
    const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();

    const handleDeleteUser = async (user) => {
        if (confirm(`Are you sure you want to delete ${user.fullname || 'this user'}?`)) {
            const loadingToast = toast.loading("Deleting user...");
            try {
                await deleteUser(user._id);
                toast.update(loadingToast, {
                    render: "User deleted successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
            } catch (err) {
                console.error("Delete user failed:", err);
                toast.update(loadingToast, {
                    render: err.message || "Failed to delete user",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        }
    };

    return (
        <div className='w-full px-8 pt-10 flex flex-col min-h-screen'>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Customers Management</h1>
                    <p className="text-slate-400 text-xs mt-1">View, filter, and manage your restaurant&apos;s registered users</p>
                </div>

                {/* Filter and Search Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Custom Role Dropdown Selector */}
                    <div ref={roleDropdownRef} className="relative inline-block text-left w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setIsRoleOpen(!isRoleOpen);
                            }}
                            className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full sm:w-auto min-w-[140px]"
                        >
                            <span>
                                {roleFilter === "" && "Role: All"}
                                {roleFilter === "admin" && "Role: Admins"}
                                {roleFilter === "user" && "Role: Users"}
                            </span>
                            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isRoleOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isRoleOpen && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-1.5 w-40 bg-[#12130c]/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
                            >
                                {[
                                    { value: "", label: "All Roles" },
                                    { value: "admin", label: "Admins" },
                                    { value: "user", label: "Users" }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            handleRoleChange(option.value);
                                            setIsRoleOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${roleFilter === option.value
                                                ? "bg-[#41431B] text-white"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search name, email, role..."
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#41431B]/50 focus:ring-1 focus:ring-[#41431B]/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* User List Table */}
            <div className="mt-6 flex-grow">
                <UserItem
                    usersData={data?.users || []}
                    isLoading={isLoading}
                    error={error}
                    pagination={data?.pagination}
                    onPageChange={handlePageChange}
                    onDeleteUser={handleDeleteUser}
                    isDeleting={isDeleting}
                />
            </div>
        </div>
    )
}