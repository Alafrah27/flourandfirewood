import express from "express";
import { createUser, getAllUsers, deleteUser } from "../controller/user.controller.js";
import { protectRoute, adminProtectRoute } from "../middleware/usermiddleware.js";

const router = express.Router()

router.post("/" , createUser);
router.get("/", protectRoute, adminProtectRoute, getAllUsers);
router.delete("/:id", protectRoute, adminProtectRoute, deleteUser);

export default router;