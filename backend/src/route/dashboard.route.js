import express from "express";
import { protectRoute, adminProtectRoute } from "../middleware/usermiddleware.js";
import { getDashboardStats } from "../controller/dashboard.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminProtectRoute, getDashboardStats);

export default router;
