"use client";

import React, { useState } from "react";
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Users, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Grid
} from "lucide-react";
import { toast } from "react-toastify";
import ActionMenu from "../../../components/ActionMenu";
import TableForm from "../../../components/TableForm";
import { 
  useGetTables, 
  useCreateTable, 
  useUpdateTable, 
  useUpdateTableStatus, 
  useDeleteTable 
} from "../../../services/tableQuery";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function TablesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQueryURL = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchQueryURL);
  const [prevSearchQueryURL, setPrevSearchQueryURL] = useState(searchQueryURL);

  // Sync state with URL parameter changes
  if (searchQueryURL !== prevSearchQueryURL) {
    setSearchQuery(searchQueryURL);
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
      if (searchQuery !== searchQueryURL) {
        updateURL({ search: searchQuery });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, searchQueryURL]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Dropdown states for custom filters
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCapacityDropdownOpen, setIsCapacityDropdownOpen] = useState(false);
  
  const statusDropdownRef = React.useRef(null);
  const capacityDropdownRef = React.useRef(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
        setIsStatusDropdownOpen(false);
      }
      if (capacityDropdownRef.current && !capacityDropdownRef.current.contains(e.target)) {
        setIsCapacityDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // API hooks
  const { data, isLoading, error } = useGetTables();
  const { mutate: createTable, isPending: isCreating } = useCreateTable();
  const { mutate: updateTable, isPending: isUpdating } = useUpdateTable();
  const { mutate: updateTableStatus } = useUpdateTableStatus();
  const { mutateAsync: deleteTable } = useDeleteTable();

  const isPending = isCreating || isUpdating;
  const tables = data?.tables || [];

  // Stats calculation
  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === "available").length;
  const occupiedTables = tables.filter(t => t.status === "occupied").length;
  const cleaningTables = tables.filter(t => t.status === "cleaning").length;

  // Client-side filtering
  const filteredTables = tables.filter((table) => {
    // 1. Search by Table Number
    const matchesSearch = searchQuery === "" || table.tableNumber.toString().includes(searchQuery);
    
    // 2. Filter by Status
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;

    // 3. Filter by Capacity
    const matchesCapacity = capacityFilter === "all" || table.capacity >= parseInt(capacityFilter);

    return matchesSearch && matchesStatus && matchesCapacity;
  });

  const handleCloseForm = () => {
    setEditingTable(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (table) => {
    setEditingTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (table) => {
    if (confirm(`Are you sure you want to delete Table #${table.tableNumber}?`)) {
      const loadingToast = toast.loading(`Deleting Table #${table.tableNumber}...`);
      try {
        await deleteTable(table._id);
        toast.update(loadingToast, {
          render: "Table deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      } catch (err) {
        console.error("Delete table failed:", err);
        toast.update(loadingToast, {
          render: err.message || "Failed to delete table",
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      }
    }
  };

  const handleStatusChange = (tableId, newStatus) => {
    const statusToast = toast.loading("Updating status...");
    updateTableStatus({ id: tableId, status: newStatus }, {
      onSuccess: () => {
        toast.update(statusToast, {
          render: "Table status updated!",
          type: "success",
          isLoading: false,
          autoClose: 2000
        });
      },
      onError: (err) => {
        toast.update(statusToast, {
          render: err.message || "Failed to update status",
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      }
    });
  };

  const handleFormSubmit = async (formData) => {
    if (editingTable) {
      updateTable({ id: editingTable._id, ...formData }, {
        onSuccess: () => {
          toast.success("Table updated successfully!");
          handleCloseForm();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update table");
        }
      });
    } else {
      createTable(formData, {
        onSuccess: () => {
          toast.success("Table created successfully!");
          handleCloseForm();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create table");
        }
      });
    }
  };

  return (
    <div className="w-full px-8 pt-10 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Tables Management</h1>
          <p className="text-slate-400 text-xs mt-1">Configure layout, seats, and monitor live occupancy status of dine-in tables</p>
        </div>
        <button
          onClick={() => {
            setEditingTable(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 text-white cursor-pointer bg-[#41431B] hover:bg-[#515422] transition-colors rounded-lg font-semibold w-fit text-sm"
        >
          <Plus size={16} />
          Add Table
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Tables</p>
            <p className="text-2xl font-bold text-white mt-1">{totalTables}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
            <Grid size={20} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium font-semibold text-emerald-400/80">Available</p>
            <p className="text-2xl font-bold text-white mt-1">{availableTables}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium font-semibold text-rose-400/80">Occupied</p>
            <p className="text-2xl font-bold text-white mt-1">{occupiedTables}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <XCircle size={20} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium font-semibold text-sky-400/80">Cleaning</p>
            <p className="text-2xl font-bold text-white mt-1">{cleaningTables}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <RefreshCw size={20} />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-6 mb-8 bg-white/5 border border-white/10 rounded-2xl p-4">
        {/* Search Table Number */}
        <div className="relative w-full xl:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by table number..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#41431B]/50 focus:ring-1 focus:ring-[#41431B]/20 transition-all"
          />
        </div>

        {/* Filters Select */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full xl:w-auto">
          {/* Status Dropdown */}
          <div ref={statusDropdownRef} className="relative inline-block text-left w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsCapacityDropdownOpen(false);
              }}
              className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full md:w-auto min-w-[140px]"
            >
              <span className="capitalize">
                {statusFilter === "all" ? "Status: All" : `Status: ${statusFilter}`}
              </span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isStatusDropdownOpen && (
              <div
                className="absolute left-0 md:right-0 md:left-auto mt-1.5 w-full md:w-48 bg-[#12130c]/95 border border-white/10 rounded-xl shadow-2xl z-50 py-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {[
                  { value: "all", label: "All Statuses" },
                  { value: "available", label: "Available" },
                  { value: "occupied", label: "Occupied" },
                  { value: "cleaning", label: "Cleaning" }
                ].map((statusOpt) => (
                  <button
                    key={statusOpt.value}
                    onClick={() => {
                      setStatusFilter(statusOpt.value);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${
                      statusFilter === statusOpt.value
                        ? "bg-[#41431B] text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {statusOpt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Capacity Dropdown */}
          <div ref={capacityDropdownRef} className="relative inline-block text-left w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsCapacityDropdownOpen(!isCapacityDropdownOpen);
                setIsStatusDropdownOpen(false);
              }}
              className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full md:w-auto min-w-[140px]"
            >
              <span>
                {capacityFilter === "all" ? "Capacity: Any" : `${capacityFilter}+ Seats`}
              </span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isCapacityDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isCapacityDropdownOpen && (
              <div
                className="absolute left-0 md:right-0 md:left-auto mt-1.5 w-full md:w-48 bg-[#12130c]/95 border border-white/10 rounded-xl shadow-2xl z-50 py-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {[
                  { value: "all", label: "Any Capacity" },
                  { value: "2", label: "2+ Seats" },
                  { value: "4", label: "4+ Seats" },
                  { value: "6", label: "6+ Seats" },
                  { value: "8", label: "8+ Seats" }
                ].map((capOpt) => (
                  <button
                    key={capOpt.value}
                    onClick={() => {
                      setCapacityFilter(capOpt.value);
                      setIsCapacityDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all text-left cursor-pointer ${
                      capacityFilter === capOpt.value
                        ? "bg-[#41431B] text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {capOpt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables Grid Content */}
      <div className="flex-grow pb-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div key={index} className="h-[200px] border border-white/10 bg-white/5 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 bg-white/5 rounded"></div>
                  <div className="h-6 w-8 bg-white/5 rounded-full"></div>
                </div>
                <div className="h-4 w-32 bg-white/5 rounded mt-4"></div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <div className="h-8 flex-1 bg-white/5 rounded-lg"></div>
                  <div className="h-8 flex-1 bg-white/5 rounded-lg"></div>
                  <div className="h-8 flex-1 bg-white/5 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="w-full p-6 text-center text-rose-400 border border-rose-500/10 bg-rose-500/5 rounded-2xl">
            <p className="font-semibold">Error Loading Seating Plan</p>
            <p className="text-xs mt-1 text-slate-400">{error.message || "Failed to fetch tables data."}</p>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="w-full text-center py-20 text-slate-400 border border-white/10 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
            <p className="font-semibold text-white">No Tables Found</p>
            <p className="text-xs text-slate-500 max-w-xs">We couldn&apos;t find any tables matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.map((table) => {
              // Status Styling
              let statusBorder = "border-white/10 hover:border-white/20";
              let statusText = "text-slate-400";
              let statusBg = "bg-white/5";
              
              if (table.status === "available") {
                statusBorder = "border-emerald-500/20 hover:border-emerald-500/40";
                statusText = "text-emerald-400";
                statusBg = "bg-emerald-500/10";
              } else if (table.status === "occupied") {
                statusBorder = "border-rose-500/20 hover:border-rose-500/40";
                statusText = "text-rose-400";
                statusBg = "bg-rose-500/10";
              } else if (table.status === "cleaning") {
                statusBorder = "border-sky-500/20 hover:border-sky-500/40";
                statusText = "text-sky-400";
                statusBg = "bg-sky-500/10";
              }

              return (
                <div 
                  key={table._id} 
                  className={`relative flex flex-col justify-between p-5 bg-white/5 border ${statusBorder} rounded-2xl transition-all duration-300 group hover:-translate-y-1 h-[200px] shadow-lg`}
                >
                  {/* Top Line: Table Title and Action Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        Table {table.tableNumber.toString().padStart(2, '0')}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">#{table.tableNumber}</span>
                    </div>
                    
                    <ActionMenu
                      actions={[
                        {
                          label: "Edit",
                          icon: Edit,
                          onClick: () => handleEditClick(table)
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          onClick: () => handleDeleteClick(table),
                          danger: true
                        }
                      ]}
                    />
                  </div>

                  {/* Middle Line: Seating Info and Badges */}
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                      <Users size={14} className="text-slate-500" />
                      <span>{table.capacity} Seats / Guests</span>
                    </div>
                    <div className="mt-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-current ${statusText} ${statusBg}`}>
                        ● {table.status}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Line: Quick Status Update Toolbar */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleStatusChange(table._id, "available")}
                      disabled={table.status === "available"}
                      className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded-lg text-center cursor-pointer transition-colors ${
                        table.status === "available"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleStatusChange(table._id, "occupied")}
                      disabled={table.status === "occupied"}
                      className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded-lg text-center cursor-pointer transition-colors ${
                        table.status === "occupied"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => handleStatusChange(table._id, "cleaning")}
                      disabled={table.status === "cleaning"}
                      className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded-lg text-center cursor-pointer transition-colors ${
                        table.status === "cleaning"
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      Cleaning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Table Modal Form */}
      {isFormOpen && (
        <TableForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          editingTable={editingTable}
          onSubmit={handleFormSubmit}
          isPending={isPending}
        />
      )}
    </div>
  );
}