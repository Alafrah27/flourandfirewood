import User from "../modal/user.modal.js";

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth().isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// admin protect route only admin can access and delete or create update ...etc

export const adminProtectRoute = async (req, res, next) => {
  try {
    if (!req.auth().isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const checkUser = await User.findOne({ clerkId: req.auth().userId });
    if (!checkUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (checkUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
