import Order from "../modal/order.modal.js";
import User from "../modal/user.modal.js";
import { getAuth } from "@clerk/express";

// Get all orders for the authenticated user
export const getAllOrders = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find orders for user, sort by latest
    const orders = await Order.find({ user: user._id })
      .populate("items.product", "productName productImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find order by ID and make sure it belongs to the authenticated user
    const order = await Order.findOne({ _id: id, user: user._id })
      .populate("items.product", "productName productImage");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get order by ID error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all orders across the entire restaurant (Admin only)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullname email")
      .populate("items.product", "productName productImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get all admin orders error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete an order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
