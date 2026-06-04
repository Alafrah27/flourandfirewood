import express from "express";
import { protectRoute, adminProtectRoute } from "../middleware/usermiddleware.js";
import { getAllOrders, getOrderById, getAllOrdersAdmin, deleteOrder } from "../controller/order.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllOrders);
router.get("/admin/all", protectRoute, adminProtectRoute, getAllOrdersAdmin);
router.get("/:id", protectRoute, getOrderById);
router.delete("/:id", protectRoute, adminProtectRoute, deleteOrder);

export default router;
