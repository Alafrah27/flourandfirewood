import mongoose from "mongoose";

const workingDaySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      required: true,
    },
    from: {
      type: String, // e.g. "09:00"
      required: true,
    },
    to: {
      type: String, // e.g. "23:00"
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const restaurantSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Basic Info ───────────────────────────────────
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantDescription: {
      type: String,
      default: "",
    },


    currency: {
      type: String,
      default: "SAR",
    },
    taxRate: {
      type: Number,
      default: 15, // Saudi VAT 15%
    },

    // ─── Location & Contact ──────────────────────────
    phone: {
      type: String,
      default: "",
    },
    
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    googleMapsUrl: {
      type: String,
      default: "",
    },

    // ─── Working Hours ───────────────────────────────
    isOpen: {
      type: Boolean,
      default: false,
    },
    closedMessage: {
      type: String,
      default: "We're currently closed. Please check back during our working hours.",
    },
    workingHours: {
      type: [workingDaySchema],
      default: [
        { day: "sunday", from: "09:00", to: "23:00", isClosed: false },
        { day: "monday", from: "09:00", to: "23:00", isClosed: false },
        { day: "tuesday", from: "09:00", to: "23:00", isClosed: false },
        { day: "wednesday", from: "09:00", to: "23:00", isClosed: false },
        { day: "thursday", from: "09:00", to: "23:00", isClosed: false },
        { day: "friday", from: "13:00", to: "23:00", isClosed: false },
        { day: "saturday", from: "09:00", to: "23:00", isClosed: false },
      ],
    },

    // ─── Ordering & Delivery ─────────────────────────
    deliveryEnabled: {
      type: Boolean,
      default: false,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    freeDeliveryMinimum: {
      type: Number,
      default: 0, // 0 means no free delivery threshold
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
    },
    estimatedDeliveryTime: {
      type: String,
      default: "30-45 min",
    },
    pickupEnabled: {
      type: Boolean,
      default: true,
    },


  
  },
  {
    timestamps: true,
  }
);

const RestaurantSettings = mongoose.model(
  "RestaurantSettings",
  restaurantSettingsSchema
);

export default RestaurantSettings;
