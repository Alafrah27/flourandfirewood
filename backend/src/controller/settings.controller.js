import { getAuth } from "@clerk/express";
import RestaurantSettings from "../modal/restauratSttings.modal.js";
import User from "../modal/user.modal.js";

// GET /api/v1/settings — Get restaurant settings (public)
export const getSettings = async (req, res) => {
  try {
    const settings = await RestaurantSettings.findOne();

    if (!settings) {
      return res.status(404).json({ message: "Restaurant settings not found" });
    }

    return res.status(200).json({ settings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get settings", error: error.message });
  }
};

// POST /api/v1/settings — Create settings (admin, one-time setup)
export const createSettings = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow one settings document
    const existing = await RestaurantSettings.findOne();
    if (existing) {
      return res.status(400).json({ message: "Settings already exist. Use PUT to update." });
    }

    const {
      restaurantName,
      restaurantDescription,
      currency,
      taxRate,
      phone,
      address,
      city,
      location,
      googleMapsUrl,
      isOpen,
      closedMessage,
      workingHours,
      deliveryEnabled,
      deliveryFee,
      freeDeliveryMinimum,
      minimumOrderAmount,
      estimatedDeliveryTime,
      pickupEnabled,
    } = req.body;

    if (!restaurantName) {
      return res.status(400).json({ message: "Restaurant name is required" });
    }

    const settings = new RestaurantSettings({
      userId: user._id,
      restaurantName,
      restaurantDescription,
      currency,
      taxRate,
      phone,
      address,
      city,
      location,
      googleMapsUrl,
      isOpen,
      closedMessage,
      workingHours,
      deliveryEnabled,
      deliveryFee,
      freeDeliveryMinimum,
      minimumOrderAmount,
      estimatedDeliveryTime,
      pickupEnabled,
    });

    await settings.save();

    return res
      .status(201)
      .json({ message: "Settings created successfully", settings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create settings", error: error.message });
  }
};

// PUT /api/v1/settings — Update settings (admin)
export const updateSettings = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const settings = await RestaurantSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found. Create them first." });
    }

    const {
      restaurantName,
      restaurantDescription,
      currency,
      taxRate,
      phone,
      address,
      city,
      location,
      googleMapsUrl,
      isOpen,
      closedMessage,
      workingHours,
      deliveryEnabled,
      deliveryFee,
      freeDeliveryMinimum,
      minimumOrderAmount,
      estimatedDeliveryTime,
      pickupEnabled,
    } = req.body;

    // Update only provided fields
    if (restaurantName !== undefined) settings.restaurantName = restaurantName;
    if (restaurantDescription !== undefined) settings.restaurantDescription = restaurantDescription;
    if (currency !== undefined) settings.currency = currency;
    if (taxRate !== undefined) settings.taxRate = taxRate;
    if (phone !== undefined) settings.phone = phone;
    if (address !== undefined) settings.address = address;
    if (city !== undefined) settings.city = city;
    if (location !== undefined) settings.location = location;
    if (googleMapsUrl !== undefined) settings.googleMapsUrl = googleMapsUrl;
    if (isOpen !== undefined) settings.isOpen = isOpen;
    if (closedMessage !== undefined) settings.closedMessage = closedMessage;
    if (workingHours !== undefined && Array.isArray(workingHours)) {
      // Merge only the days that were sent — don't replace the full array
      workingHours.forEach((incoming) => {
        const existingIndex = settings.workingHours.findIndex(
          (d) => d.day === incoming.day
        );
        if (existingIndex !== -1) {
          // Update existing day entry
          if (incoming.from !== undefined) settings.workingHours[existingIndex].from = incoming.from;
          if (incoming.to !== undefined) settings.workingHours[existingIndex].to = incoming.to;
          if (incoming.isClosed !== undefined) settings.workingHours[existingIndex].isClosed = incoming.isClosed;
        } else {
          // New day entry — push it
          settings.workingHours.push(incoming);
        }
      });
      settings.markModified("workingHours");
    }
    if (deliveryEnabled !== undefined) settings.deliveryEnabled = deliveryEnabled;
    if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
    if (freeDeliveryMinimum !== undefined) settings.freeDeliveryMinimum = freeDeliveryMinimum;
    if (minimumOrderAmount !== undefined) settings.minimumOrderAmount = minimumOrderAmount;
    if (estimatedDeliveryTime !== undefined) settings.estimatedDeliveryTime = estimatedDeliveryTime;
    if (pickupEnabled !== undefined) settings.pickupEnabled = pickupEnabled;

    await settings.save();

    return res
      .status(200)
      .json({ message: "Settings updated successfully", settings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update settings", error: error.message });
  }
};

// PATCH /api/v1/settings/toggle-open — Quick toggle isOpen (admin)
export const toggleOpen = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const settings = await RestaurantSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    settings.isOpen = !settings.isOpen;
    await settings.save();

    return res.status(200).json({
      message: `Restaurant is now ${settings.isOpen ? "open" : "closed"}`,
      isOpen: settings.isOpen,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to toggle status", error: error.message });
  }
};
