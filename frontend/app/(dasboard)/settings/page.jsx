"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
    Settings,
    Store,
    MapPin,
    Clock,
    Truck,
    Save,
    Phone,
    DollarSign,
    MapPinned,
    Timer,
    Package,
    CircleDot,
    Percent,
    Building2,
    Globe,
    Check,
    X,
    Copy,
    Sparkles,
    CalendarDays,
    ChevronRight,
    HelpCircle,
    RotateCcw
} from "lucide-react";
import {
    useGetSettings,
    useCreateSettings,
    useUpdateSettings,
    useToggleOpen,
} from "../../../services/settingsQuery";
import SkeletonLoader from "../../../components/SkeletonLoader";

// ─── Validation Schema ──────────────────────────────────
const settingsSchema = z.object({
    restaurantName: z.string().min(2, "Restaurant name is required"),
    restaurantDescription: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    taxRate: z.coerce.number().min(0).max(100),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    googleMapsUrl: z.string().optional(),
    locationLat: z.coerce.number().optional().or(z.literal("")),
    locationLng: z.coerce.number().optional().or(z.literal("")),
    closedMessage: z.string().optional(),
    deliveryEnabled: z.boolean(),
    deliveryFee: z.coerce.number().min(0),
    freeDeliveryMinimum: z.coerce.number().min(0),
    minimumOrderAmount: z.coerce.number().min(0),
    estimatedDeliveryTime: z.string().optional(),
    pickupEnabled: z.boolean(),
    workingHours: z.array(
        z.object({
            day: z.string(),
            from: z.string(),
            to: z.string(),
            isClosed: z.boolean(),
        })
    ),
});

const DEFAULT_WORKING_HOURS = [
    { day: "sunday", from: "09:00", to: "23:00", isClosed: false },
    { day: "monday", from: "09:00", to: "23:00", isClosed: false },
    { day: "tuesday", from: "09:00", to: "23:00", isClosed: false },
    { day: "wednesday", from: "09:00", to: "23:00", isClosed: false },
    { day: "thursday", from: "09:00", to: "23:00", isClosed: false },
    { day: "friday", from: "13:00", to: "23:00", isClosed: false },
    { day: "saturday", from: "09:00", to: "23:00", isClosed: false },
];

// ─── Reusable Field Input with Inline Icon ──────────────
function FieldInput({ label, error, icon: Icon, ...props }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    className={`w-full py-2.5 bg-slate-950/40 border rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200 ${
                        Icon ? "pl-11 pr-4" : "px-4"
                    } ${
                        error
                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                            : "border-white/10 focus:border-[#A2A657] focus:ring-1 focus:ring-[#A2A657]/20"
                    }`}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">
                    {error.message}
                </span>
            )}
        </div>
    );
}

// ─── Toggle Card Component ──────────────────────────────
function ToggleCard({ checked, onChange, title, description, icon: Icon }) {
    return (
        <div 
            onClick={() => onChange(!checked)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 select-none ${
                checked 
                    ? "bg-[#41431B]/15 border-[#A2A657]/30 shadow-lg shadow-[#41431B]/5" 
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
            }`}
        >
            <div className={`p-2.5 rounded-xl transition-colors ${
                checked ? "bg-[#A2A657]/20 text-[#A2A657]" : "bg-white/5 text-slate-400"
            }`}>
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{title}</span>
                    <div className="relative">
                        <div className={`w-8 h-4.5 rounded-full transition-all duration-200 ${
                            checked ? "bg-[#A2A657]" : "bg-white/10"
                        }`} />
                        <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-slate-950 rounded-full shadow transition-transform duration-200 ${
                            checked ? "translate-x-3.5" : "translate-x-0"
                        }`} />
                    </div>
                </div>
                {description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
                )}
            </div>
        </div>
    );
}

// ─── Main Settings Page ─────────────────────────────────
export default function SettingsPage() {
    const { data: settings, isLoading, error } = useGetSettings();
    const { mutateAsync: createSettings, isPending: isCreating } = useCreateSettings();
    const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateSettings();
    const { mutateAsync: toggleOpen, isPending: isToggling } = useToggleOpen();

    const [activeTab, setActiveTab] = useState("profile");
    const [changedDays, setChangedDays] = useState(new Set());

    const isNew = !settings;
    const isSaving = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            restaurantName: "",
            restaurantDescription: "",
            currency: "SAR",
            taxRate: 15,
            phone: "",
            address: "",
            city: "",
            googleMapsUrl: "",
            locationLat: "",
            locationLng: "",
            closedMessage: "",
            deliveryEnabled: false,
            deliveryFee: 0,
            freeDeliveryMinimum: 0,
            minimumOrderAmount: 0,
            estimatedDeliveryTime: "30-45 min",
            pickupEnabled: true,
            workingHours: DEFAULT_WORKING_HOURS,
        },
    });

    // Populate form values when data resolves
    useEffect(() => {
        if (settings) {
            reset({
                restaurantName: settings.restaurantName || "",
                restaurantDescription: settings.restaurantDescription || "",
                currency: settings.currency || "SAR",
                taxRate: settings.taxRate ?? 15,
                phone: settings.phone || "",
                address: settings.address || "",
                city: settings.city || "",
                googleMapsUrl: settings.googleMapsUrl || "",
                locationLat: settings.location?.lat ?? "",
                locationLng: settings.location?.lng ?? "",
                closedMessage: settings.closedMessage || "",
                deliveryEnabled: settings.deliveryEnabled ?? false,
                deliveryFee: settings.deliveryFee ?? 0,
                freeDeliveryMinimum: settings.freeDeliveryMinimum ?? 0,
                minimumOrderAmount: settings.minimumOrderAmount ?? 0,
                estimatedDeliveryTime: settings.estimatedDeliveryTime || "30-45 min",
                pickupEnabled: settings.pickupEnabled ?? true,
                workingHours: settings.workingHours?.length > 0 ? settings.workingHours : DEFAULT_WORKING_HOURS,
            });
            setChangedDays(new Set()); // Reset tracked changes when server data loads
        }
    }, [settings, reset]);

    const deliveryEnabled = watch("deliveryEnabled");
    const workingHours = watch("workingHours") || DEFAULT_WORKING_HOURS;
    const restaurantName = watch("restaurantName");
    const restaurantDescription = watch("restaurantDescription");

    // ─── Submit Form ────────────────────────────────────
    const onSubmit = async (data) => {
        const loadingToast = toast.loading(isNew ? "Creating settings..." : "Saving settings...");
        try {
            const payload = {
                restaurantName: data.restaurantName,
                restaurantDescription: data.restaurantDescription,
                currency: data.currency,
                taxRate: Number(data.taxRate),
                phone: data.phone,
                address: data.address,
                city: data.city,
                googleMapsUrl: data.googleMapsUrl,
                location: {
                    lat: data.locationLat ? Number(data.locationLat) : undefined,
                    lng: data.locationLng ? Number(data.locationLng) : undefined,
                },
                closedMessage: data.closedMessage,
                // Only send days that were actually changed (on update)
                // On create, send all 7 days
                workingHours: isNew
                    ? data.workingHours
                    : changedDays.size > 0
                        ? data.workingHours.filter((d) => changedDays.has(d.day))
                        : undefined,
                deliveryEnabled: data.deliveryEnabled,
                deliveryFee: Number(data.deliveryFee),
                freeDeliveryMinimum: Number(data.freeDeliveryMinimum),
                minimumOrderAmount: Number(data.minimumOrderAmount),
                estimatedDeliveryTime: data.estimatedDeliveryTime,
                pickupEnabled: data.pickupEnabled,
            };

            if (isNew) {
                await createSettings(payload);
            } else {
                await updateSettings(payload);
            }

            toast.update(loadingToast, {
                render: isNew ? "Settings created successfully!" : "Settings saved successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setChangedDays(new Set()); // Clear tracked day changes after successful save
        } catch (err) {
            toast.update(loadingToast, {
                render: err.message || "Failed to save settings",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    // ─── Toggle Open/Close Status ───────────────────────
    const handleToggleOpen = async () => {
        const loadingToast = toast.loading("Updating restaurant status...");
        try {
            const result = await toggleOpen();
            toast.update(loadingToast, {
                render: result.message,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (err) {
            toast.update(loadingToast, {
                render: err.message || "Failed to toggle status",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    // ─── Working Hours Handlers ─────────────────────────
    const updateWorkingDay = (index, field, value) => {
        const updated = [...workingHours];
        updated[index] = { ...updated[index], [field]: value };
        setValue("workingHours", updated, { shouldDirty: true });
        setChangedDays((prev) => new Set(prev).add(updated[index].day));
    };

    const copyMondayHoursToAll = () => {
        const mondayHours = workingHours.find(h => h.day === "monday");
        if (!mondayHours) return;
        const updated = workingHours.map(h => ({
            ...h,
            from: mondayHours.from,
            to: mondayHours.to,
            isClosed: mondayHours.isClosed
        }));
        setValue("workingHours", updated, { shouldDirty: true });
        setChangedDays(new Set(updated.map(h => h.day)));
        toast.info("Copied Monday hours to all operating days");
    };

    const applyPresetHours = (fromTime, toTime) => {
        const updated = workingHours.map(h => ({
            ...h,
            from: fromTime,
            to: toTime
        }));
        setValue("workingHours", updated, { shouldDirty: true });
        setChangedDays(new Set(updated.map(h => h.day)));
        toast.info(`Standardized hours to ${fromTime} - ${toTime}`);
    };

    // ─── Tab Metadata ───────────────────────────────────
    const tabs = [
        { id: "profile", label: "Store Profile", desc: "Basic details & currency", icon: Store },
        { id: "contact", label: "Contact & Location", desc: "Phone, location & maps", icon: MapPin },
        { id: "hours", label: "Operating Hours", desc: "Schedule & closed settings", icon: Clock },
        { id: "delivery", label: "Delivery & Service", desc: "Shipping fees & constraints", icon: Truck },
    ];

    if (isLoading) {
        return (
            <div className="w-full px-8 pt-10">
                <SkeletonLoader />
            </div>
        );
    }

    if (error && error.message !== "Restaurant settings not found") {
        return (
            <div className="w-full px-8 pt-10">
                <div className="p-8 text-center text-rose-400 border border-rose-500/10 bg-rose-500/5 rounded-2xl max-w-xl mx-auto">
                    <p className="font-bold text-lg">Failed to load restaurant settings</p>
                    <p className="text-sm mt-2 text-slate-400">{error.message}</p>
                </div>
            </div>
        );
    }

    // Get logo initials
    const nameInitials = restaurantName
        ? restaurantName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
        : "Store";

    return (
        <div className="w-full px-6 py-8 flex flex-col min-h-screen text-slate-100 bg-slate-900">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-white">
                        <Settings className="text-[#A2A657]" size={24} />
                        Restaurant Control Center
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        {isNew
                            ? "Configure your restaurant settings for the first time"
                            : "Manage operation status, locations, timings, and delivery policies"}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-24">
                
                {/* LEFT COLUMN: Navigation & Live Preview */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Tab Navigation Menu */}
                    <div className="p-2 rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-md flex flex-col gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left group ${
                                        isActive
                                            ? "bg-[#41431B]/20 border border-[#A2A657]/30 text-[#A2A657]"
                                            : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${
                                        isActive ? "bg-[#A2A657]/15 text-[#A2A657]" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                                    }`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{tab.label}</p>
                                        <p className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors mt-0.5 truncate">{tab.desc}</p>
                                    </div>
                                    <ChevronRight size={14} className={`ml-auto opacity-0 transition-opacity duration-200 ${
                                        isActive ? "opacity-100 text-[#A2A657]" : "group-hover:opacity-40"
                                    }`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Live Preview Card */}
                    <div className="rounded-2xl border border-white/5 bg-slate-950/30 overflow-hidden shadow-xl">
                        {/* Mock Cover Banner */}
                        <div className="h-28 relative flex items-end p-4 border-b border-white/5">
                            <div className="absolute inset-0 bg-slate-950/20" />
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#A2A657] to-[#41431B] flex items-center justify-center font-bold text-white text-base shadow-md ring-2 ring-slate-900">
                                    {nameInitials}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate drop-shadow-sm">{restaurantName || "My Restaurant"}</h4>
                                    <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                                        <MapPin size={10} />
                                        {watch("city") || "Address unset"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Panel */}
                        <div className="p-5 flex flex-col gap-4">
                            {!isNew ? (
                                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Store Status</span>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            settings?.isOpen
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"
                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${settings?.isOpen ? "bg-emerald-400" : "bg-amber-400"}`} />
                                            {settings?.isOpen ? "Open" : "Closed"}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Control order intake. Closing the store suspends incoming checkout operations.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleToggleOpen}
                                        disabled={isToggling}
                                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                                            settings?.isOpen
                                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                        }`}
                                    >
                                        <CircleDot size={12} />
                                        {settings?.isOpen ? "Shut Down Operations" : "Resume Operations"}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-slate-500">
                                    Create store profile to activate store controls
                                </div>
                            )}

                            {/* Info Quick List */}
                            <div className="flex flex-col gap-2.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">VAT Registered:</span>
                                    <span className="font-semibold text-slate-300">{watch("taxRate")}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Local Currency:</span>
                                    <span className="font-semibold text-slate-300">{watch("currency")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Service Types:</span>
                                    <span className="font-semibold text-slate-300">
                                        {deliveryEnabled ? "Delivery & " : ""}Pickup
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Settings Form Controls */}
                <div className="lg:col-span-8">
                    
                    {/* Tab 1: Profile */}
                    {activeTab === "profile" && (
                        <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-md flex flex-col gap-6 animate-fadeIn">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Store size={18} className="text-[#A2A657]" />
                                    Store Profile
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Configure name, public biography, currency indicators, and VAT percentages.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FieldInput
                                    label="Restaurant Name"
                                    placeholder="e.g. Flour & Firewood"
                                    icon={Store}
                                    error={errors.restaurantName}
                                    {...register("restaurantName")}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldInput
                                        label="Currency Code"
                                        placeholder="SAR"
                                        icon={DollarSign}
                                        error={errors.currency}
                                        {...register("currency")}
                                    />
                                    <FieldInput
                                        label="Tax Rate (VAT) %"
                                        type="number"
                                        placeholder="15"
                                        icon={Percent}
                                        step="0.1"
                                        error={errors.taxRate}
                                        {...register("taxRate")}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Public Biography / Description
                                </label>
                                <textarea
                                    placeholder="Brief narrative of your cuisine type, cooking style, or kitchen goals..."
                                    rows={4}
                                    {...register("restaurantDescription")}
                                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#A2A657] focus:ring-1 focus:ring-[#A2A657]/20 transition-all resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Contact & Location */}
                    {activeTab === "contact" && (
                        <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-md flex flex-col gap-6 animate-fadeIn">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <MapPin size={18} className="text-[#A2A657]" />
                                    Contact & Location
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Specify support contact numbers, street directions, and geographic coordinates for navigation.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FieldInput
                                    label="Support Phone"
                                    placeholder="e.g. +966 5XXXXXXXX"
                                    icon={Phone}
                                    error={errors.phone}
                                    {...register("phone")}
                                />
                                <FieldInput
                                    label="City"
                                    placeholder="e.g. Riyadh"
                                    icon={Building2}
                                    error={errors.city}
                                    {...register("city")}
                                />
                            </div>

                            <FieldInput
                                label="Street Address"
                                placeholder="e.g. King Fahd Road, Al Olaya District"
                                icon={MapPinned}
                                error={errors.address}
                                {...register("address")}
                            />

                            <div className="border-t border-white/5 pt-5 mt-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Coordinates & Online Map</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="md:col-span-1">
                                        <FieldInput
                                            label="Latitude"
                                            type="number"
                                            step="any"
                                            placeholder="e.g. 24.7136"
                                            error={errors.locationLat}
                                            {...register("locationLat")}
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FieldInput
                                            label="Longitude"
                                            type="number"
                                            step="any"
                                            placeholder="e.g. 46.6753"
                                            error={errors.locationLng}
                                            {...register("locationLng")}
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FieldInput
                                            label="Google Maps URL"
                                            placeholder="https://maps.google.com/..."
                                            icon={Globe}
                                            error={errors.googleMapsUrl}
                                            {...register("googleMapsUrl")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Operating Hours */}
                    {activeTab === "hours" && (
                        <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-md flex flex-col gap-6 animate-fadeIn">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Clock size={18} className="text-[#A2A657]" />
                                        Operating Hours
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Manage standard weekly operation durations and closure notifications.</p>
                                </div>
                            </div>

                            <FieldInput
                                label="Custom Closed Notice / Banner Message"
                                placeholder="e.g. We are closed for maintenance. Resuming normal hours tomorrow."
                                icon={HelpCircle}
                                error={errors.closedMessage}
                                {...register("closedMessage")}
                            />

                            {/* Scheduler presets */}
                            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                        <Sparkles size={12} className="text-[#A2A657]" />
                                        Scheduler Presets
                                    </span>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Quickly apply standard operational times across all days.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={copyMondayHoursToAll}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#A2A657]/15 border border-white/10 hover:border-[#A2A657]/30 text-[10px] font-bold text-slate-300 hover:text-[#A2A657] rounded-lg transition-all cursor-pointer"
                                    >
                                        <Copy size={10} />
                                        Copy Monday Hours to All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPresetHours("09:00", "23:00")}
                                        className="px-2.5 py-1.5 bg-white/5 hover:bg-[#A2A657]/15 border border-white/10 hover:border-[#A2A657]/30 text-[10px] font-bold text-slate-300 hover:text-[#A2A657] rounded-lg transition-all cursor-pointer"
                                    >
                                        9:00 AM - 11:00 PM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPresetHours("11:00", "23:00")}
                                        className="px-2.5 py-1.5 bg-white/5 hover:bg-[#A2A657]/15 border border-white/10 hover:border-[#A2A657]/30 text-[10px] font-bold text-slate-300 hover:text-[#A2A657] rounded-lg transition-all cursor-pointer"
                                    >
                                        11:00 AM - 11:00 PM
                                    </button>
                                </div>
                            </div>

                            {/* Working Hours Rows */}
                            <div className="space-y-2.5">
                                {workingHours.map((day, index) => (
                                    <div
                                        key={day.day}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
                                            day.isClosed
                                                ? "bg-slate-950/10 border-white/5 opacity-50"
                                                : "bg-slate-950/40 border-white/5 shadow-sm"
                                        }`}
                                    >
                                        {/* Day Label */}
                                        <div className="flex items-center gap-2.5 w-32 flex-shrink-0">
                                            <span className={`w-1.5 h-1.5 rounded-full ${day.isClosed ? "bg-rose-500" : "bg-emerald-500"}`} />
                                            <span className="text-sm font-bold text-white capitalize">
                                                {day.day}
                                            </span>
                                        </div>

                                        {/* Scheduler Hours Inputs */}
                                        <div className="flex items-center gap-3 flex-1 justify-start sm:justify-end">
                                            {day.isClosed ? (
                                                <div className="py-1.5 text-xs text-rose-400 font-semibold uppercase tracking-wider">
                                                    Closed for Business
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={day.from}
                                                        onChange={(e) =>
                                                            updateWorkingDay(index, "from", e.target.value)
                                                        }
                                                        className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#A2A657] transition-all [color-scheme:dark]"
                                                    />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">To</span>
                                                    <input
                                                        type="time"
                                                        value={day.to}
                                                        onChange={(e) =>
                                                            updateWorkingDay(index, "to", e.target.value)
                                                        }
                                                        className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#A2A657] transition-all [color-scheme:dark]"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Toggle status trigger */}
                                        <button
                                            type="button"
                                            onClick={() => updateWorkingDay(index, "isClosed", !day.isClosed)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer select-none ${
                                                day.isClosed
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                            }`}
                                        >
                                            {day.isClosed ? "Mark Open" : "Mark Closed"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Delivery & Services */}
                    {activeTab === "delivery" && (
                        <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-md flex flex-col gap-6 animate-fadeIn">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Truck size={18} className="text-[#A2A657]" />
                                    Delivery & Service Policies
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Configure shipping capabilities, fees, local minimum quantities, and customer collection types.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <ToggleCard
                                    checked={watch("deliveryEnabled")}
                                    onChange={(val) => setValue("deliveryEnabled", val, { shouldDirty: true })}
                                    title="Enable Delivery Services"
                                    description="Permit customers to request home dispatching on orders."
                                    icon={Truck}
                                />
                                <ToggleCard
                                    checked={watch("pickupEnabled")}
                                    onChange={(val) => setValue("pickupEnabled", val, { shouldDirty: true })}
                                    title="Enable Store Collection"
                                    description="Allow customers to place order pickups on premise."
                                    icon={Package}
                                />
                            </div>

                            {/* Subfields for delivery fee thresholds */}
                            {deliveryEnabled && (
                                <div className="border-t border-white/5 pt-5 flex flex-col gap-5 animate-slideDown">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FieldInput
                                            label="Shipping / Delivery Fee"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            icon={DollarSign}
                                            error={errors.deliveryFee}
                                            {...register("deliveryFee")}
                                        />
                                        <FieldInput
                                            label="Free Shipping Minimum"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            icon={DollarSign}
                                            error={errors.freeDeliveryMinimum}
                                            {...register("freeDeliveryMinimum")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FieldInput
                                            label="Minimum Checkout Amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            icon={DollarSign}
                                            error={errors.minimumOrderAmount}
                                            {...register("minimumOrderAmount")}
                                        />
                                        <FieldInput
                                            label="Estimated Dispatch Time"
                                            placeholder="e.g. 30-45 min"
                                            icon={Timer}
                                            error={errors.estimatedDeliveryTime}
                                            {...register("estimatedDeliveryTime")}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* STICKY ACTION SAVE BAR (Visible only when form is dirty) */}
                {isDirty && (
                    <div className="fixed bottom-6 right-6 lg:right-10 z-40 flex items-center justify-between gap-6 px-6 py-4 bg-slate-950/90 border border-[#A2A657]/30 backdrop-blur-md rounded-2xl shadow-xl animate-slideUp max-w-md w-auto">
                        <div className="flex flex-col pr-4 border-r border-white/10">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#A2A657] animate-pulse" />
                                Unsaved Changes
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">Press save to persist updates</span>
                        </div>
                        <div className="flex items-center gap-3.5">
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    toast.info("Settings changes discarded");
                                }}
                                className="px-3.5 py-2 hover:bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                                <RotateCcw size={12} />
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2.5 bg-[#41431B] hover:bg-[#52541f] text-xs font-bold text-white rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                                ) : (
                                    <Save size={13} />
                                )}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}