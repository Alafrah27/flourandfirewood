import express from "express";
import {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  FindProductById,
} from "../controller/product.controller.js";
import {
  adminProtectRoute,
  protectRoute,
} from "../middleware/usermiddleware.js";

export const router = express.Router();

router.get("/", getProduct);
router.post("/", protectRoute, adminProtectRoute, createProduct);
router.get("/:id", FindProductById);
router.delete("/:id", protectRoute, adminProtectRoute, deleteProduct);
router.put("/:id", protectRoute, adminProtectRoute, updateProduct);

export default router;
