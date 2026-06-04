import User from "../modal/user.modal.js";
import Order from "../modal/order.modal.js";
import Cart from "../modal/cart.modal.js";
import axios from "axios";
import { getAuth } from "@clerk/express";

/**
 * Calculates the total price from cart items (base price + sides) * quantity.
 */
const calculateCartTotal = (products) => {
  return products.reduce((sum, item) => {
    const sidesTotal = (item.sides || []).reduce(
      (s, side) => s + side.side_price,
      0,
    );
    return sum + (item.price + sidesTotal) * item.quantity;
  }, 0);
};

/**
 * POST /api/v1/moyasar/payment/:paymentId
 *
 * Verifies a Moyasar payment and creates an order from the user's cart.
 *
 * Flow:
 *  1. Authenticate the user via Clerk
 *  2. Check for duplicate paymentId (prevent replay)
 *  3. Fetch payment details from Moyasar (GET with Basic Auth)
 *  4. Verify status === "paid"
 *  5. Load the user's cart from DB (source of truth for items & pricing)
 *  6. Verify Moyasar amount matches the cart total (in halalas)
 *  7. Snapshot cart items into a new Order document
 *  8. Clear the cart
 */
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { userId } = getAuth(req);

    // ── 1. Auth check ──────────────────────────────────────────────────────
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ── 2. Duplicate payment check ─────────────────────────────────────────
    const existingOrder = await Order.findOne({ paymentId });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "This payment has already been processed",
      });
    }

    // ── 3. Fetch payment from Moyasar (GET + Basic Auth) ───────────────────
    const response = await axios.get(
      `https://api.moyasar.com/v1/payments/${paymentId}`,
      {
        auth: {
          username: process.env.MOYASAR_SECRET_KEY,
          password: "",
        },
      },
    );
    const payment = response.data;

    // ── 4. Verify payment status ───────────────────────────────────────────
    if (payment.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
        paymentStatus: payment.status,
      });
    }

    // ── 5. Load the cart from DB (source of truth) ─────────────────────────
    const cart = await Cart.findOne({ user: user._id }).populate(
      "products.product",
      "productName productImage",
    );

    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }

    // ── 6. Verify Moyasar amount matches cart total ────────────────────────
    // Moyasar amounts are in the smallest currency unit (halalas for SAR)
    // e.g. 10.00 SAR = 1000 halalas
    const cartTotal = calculateCartTotal(cart.products);
    const cartTotalInHalalas = Math.round(cartTotal * 100);

    if (payment.amount !== cartTotalInHalalas) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match cart total",
      });
    }

    // ── 7. Snapshot cart items into the Order ───────────────────────────────
    const orderItems = cart.products.map((item) => ({
      product: item.product._id,
      productName: item.product.productName,
      productImage: item.product.productImage || "",
      price: item.price,
      quantity: item.quantity,
      sides: (item.sides || []).map((side) => ({
        side_name: side.side_name,
        side_price: side.side_price,
      })),
    }));

    const order = new Order({
      user: user._id,
      items: orderItems,
      totalPrice: cartTotal,
      status: "paid",
      paymentId: payment.id,
    });
    await order.save();

    // ── 8. Clear the cart ──────────────────────────────────────────────────
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
