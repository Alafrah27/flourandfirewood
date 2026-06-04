import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controller/category.controller.js";
import {
  protectRoute,
  adminProtectRoute,
} from "../middleware/usermiddleware.js";
const router = express.Router();

router.get("/", getCategories);
router.post("/", protectRoute, adminProtectRoute, createCategory);
router.put("/:id", protectRoute, adminProtectRoute, updateCategory);
router.delete("/:id", protectRoute, adminProtectRoute, deleteCategory);

export default router;
