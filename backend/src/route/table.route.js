import express from "express";
import {
  createTable,
  getTables,
  getTableById,
  updateTable,
  updateTableStatus,
  deleteTable,
} from "../controller/table.controller.js";
import {
  adminProtectRoute,
  protectRoute,
} from "../middleware/usermiddleware.js";

export const router = express.Router();

router.get("/", getTables);
router.post("/", protectRoute, adminProtectRoute, createTable);
router.get("/:id", getTableById);
router.put("/:id", protectRoute, adminProtectRoute, updateTable);
router.patch("/:id/status", protectRoute, updateTableStatus);
router.delete("/:id", protectRoute, adminProtectRoute, deleteTable);

export default router;
