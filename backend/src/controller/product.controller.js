import { getAuth } from "@clerk/express";
import Product from "../modal/product.modal.js";
import User from "../modal/user.modal.js";
import imagekit from "../lib/imagekit.js";

export const createProduct = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      productName,
      productPrice,
      productImage,
      imagekitFileId,
      productDescription,
      productCategory,
      side,
    } = req.body;

    if (
      !productName ||
      !productPrice ||
      !productImage ||
      !imagekitFileId ||
      !productDescription ||
      !productCategory
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      userId: user._id,
      productName,
      productPrice,
      productImage,
      imagekitFileId,
      productDescription,
      productCategory,
      side: side && Array.isArray(side) ? side : [],
    });

    await product.save();
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default limit of 5
    const skip = (page - 1) * limit;

    const { sort, featured, category, search, random } = req.query;

    // Build query object
    const query = {};

    // 1. Feature Filter
    if (featured === "true") {
      query.featured = true;
    } else if (featured === "false") {
      query.featured = false;
    }

    // 2. Category Filter
    if (category) {
      query.productCategory = category;
    }

    // 3. Optional Search query (for name or description)
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { productDescription: { $regex: search, $options: "i" } },
      ];
    }

    // 4. Random Sampling
    if (random === "true") {
      const randomProducts = await Product.aggregate([
        { $match: query },
        { $sample: { size: limit } },
      ]);
      return res.status(200).json({
        products: randomProducts,
        currentPage: 1,
        totalPages: 1,
        totalProducts: randomProducts.length,
        limit,
      });
    }

    // Build sort options
    let sortOption = {};
    if (sort === "asc") {
      sortOption = { productName: 1 };
    } else if (sort === "desc") {
      sortOption = { productName: -1 };
    } else if (sort === "highest") {
      sortOption = { productPrice: -1 };
    } else if (sort === "lowest") {
      sortOption = { productPrice: 1 };
    } else {
      // Default sort (latest created)
      sortOption = { createdAt: -1 };
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      limit,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get products", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id } = req.params;
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
    });

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    // Delete main product image from ImageKit
    if (deletedProduct.imagekitFileId) {
      try {
        await imagekit.deleteFile(deletedProduct.imagekitFileId);
      } catch (err) {
        console.error("Failed to delete main image from ImageKit:", err);
      }
    }

    // Delete all side item images from ImageKit
    if (deletedProduct.side && deletedProduct.side.length > 0) {
      for (const sideItem of deletedProduct.side) {
        if (sideItem.side_imagekitFileId) {
          try {
            await imagekit.deleteFile(sideItem.side_imagekitFileId);
          } catch (err) {
            console.error(
              `Failed to delete side image (${sideItem.side_name}) from ImageKit:`,
              err,
            );
          }
        }
      }
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id } = req.params;
    const {
      productName,
      productPrice,
      productImage,
      imagekitFileId,
      productDescription,
      productCategory,
      featured,
      side,
    } = req.body;

    // Fetch existing product to compare images before updating
    const existingProduct = await Product.findOne({
      _id: id,
    });
    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    // Delete old main image from ImageKit if a new one is provided
    if (
      imagekitFileId &&
      existingProduct.imagekitFileId &&
      existingProduct.imagekitFileId !== imagekitFileId
    ) {
      try {
        await imagekit.deleteFile(existingProduct.imagekitFileId);
      } catch (err) {
        console.error("Failed to delete old main image from ImageKit:", err);
      }
    }

    // Delete removed side images from ImageKit
    if (existingProduct.side && existingProduct.side.length > 0) {
      const newSideFileIds = new Set(
        (side || []).map((s) => s.side_imagekitFileId).filter(Boolean),
      );
      for (const oldSide of existingProduct.side) {
        if (
          oldSide.side_imagekitFileId &&
          !newSideFileIds.has(oldSide.side_imagekitFileId)
        ) {
          try {
            await imagekit.deleteFile(oldSide.side_imagekitFileId);
          } catch (err) {
            console.error(
              `Failed to delete old side image (${oldSide.side_name}) from ImageKit:`,
              err,
            );
          }
        }
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      {
        productName,
        productPrice: Number(productPrice),
        productImage,
        imagekitFileId,
        productDescription,
        productCategory,
        featured: !!featured,
        side: side && Array.isArray(side) ? side : [],
      },
      { new: true },
    );

    return res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

export const FindProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to find product", error: error.message });
  }
};
