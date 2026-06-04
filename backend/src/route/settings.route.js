import express from "express";
import {
  getSettings,
  createSettings,
  updateSettings,
  toggleOpen,
} from "../controller/settings.controller.js";
import {
  protectRoute,
  adminProtectRoute,
} from "../middleware/usermiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.post("/", protectRoute, adminProtectRoute, createSettings);
router.put("/", protectRoute, adminProtectRoute, updateSettings);
router.patch("/toggle-open", protectRoute, adminProtectRoute, toggleOpen);

export default router;
