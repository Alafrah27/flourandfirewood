import imagekit from "../lib/imagekit.js";
import Category from "../modal/category.modal.js";
import User from "../modal/user.modal.js";
import { getAuth } from "@clerk/express";

export const createCategory = async (req, res) => {
  try {
    const { categoryName, imageUrl, imagekitFileId, backgroundColor } =
      req.body;
    const auth = getAuth(req);
    const { userId } = auth;

    if (!categoryName || !imageUrl || !imagekitFileId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const checkUser = await User.findOne({ clerkId: userId });
    if (!checkUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const category = new Category({
      userId: checkUser._id,
      categoryName,
      imageUrl,
      imagekitFileId,
      backgroundColor,
    });

    await category.save();

    return res.status(201).json({ success: true, category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const auth = getAuth(req);
    const { userId } = auth;

    // 1. Validate User
    const checkUser = await User.findOne({ clerkId: userId });
    if (!checkUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the category to verify ownership and extract imagekitFileId
    const category = await Category.findOne({
      _id: id,
      userId: checkUser._id,
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found or you are not authorized to delete it",
      });
    }

    // Delete image from ImageKit if it exists
    if (category.imagekitFileId) {
      try {
        await imagekit.deleteFile(category.imagekitFileId);
      } catch (error) {
        console.error("Failed to delete image from ImageKit:", error);
      }
    }

    // Delete from DB
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error inside deleteCategory:", error);

    // Handle invalid Mongoose ObjectIDs cleanly instead of generic 500 crashes
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Category ID format" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("userId", "name email");
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error inside getCategories:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, imageUrl, imagekitFileId, backgroundColor } =
      req.body;
    const auth = getAuth(req);
    const { userId } = auth;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const checkUser = await User.findOne({ clerkId: userId });
    if (!checkUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const category = await Category.findOne({ _id: id, userId: checkUser._id });
    if (!category) {
      return res
        .status(404)
        .json({
          error: "Category not found or you are not authorized to edit it",
        });
    }

    // If a new image is provided, delete the old image from ImageKit
    if (
      imagekitFileId &&
      category.imagekitFileId &&
      category.imagekitFileId !== imagekitFileId
    ) {
      try {
        await imagekit.deleteFile(category.imagekitFileId);
      } catch (error) {
        console.error(
          "Failed to delete old image from ImageKit during update:",
          error,
        );
      }
    }

    // Update the category fields
    if (categoryName) category.categoryName = categoryName;
    if (imageUrl) category.imageUrl = imageUrl;
    if (imagekitFileId) category.imagekitFileId = imagekitFileId;
    if (backgroundColor !== undefined)
      category.backgroundColor = backgroundColor;

    await category.save();

    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error inside updateCategory:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Category ID format" });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name must be unique" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
