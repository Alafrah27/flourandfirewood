import express from "express";
import { protectRoute } from "../middleware/usermiddleware.js";
import { verifyPayment } from "../controller/verify-payment.controller.js";

const router = express.Router();

router.post("/:paymentId", protectRoute, verifyPayment);

export default router;
