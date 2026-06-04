import express from "express";
import { protectRoute } from "../middleware/usermiddleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cart.controller.js";

const router = express.Router();

// All cart routes require authentication
router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.put("/", protectRoute, updateCartItem);
router.delete("/:productId", protectRoute, removeFromCart);
router.delete("/", protectRoute, clearCart);

export default router;
