import { getAuth } from "@clerk/express";
import Cart from "../modal/cart.modal.js";
import Product from "../modal/product.modal.js";
import User from "../modal/user.modal.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves the authenticated Clerk user to a database User document.
 * Returns { user } on success, or sends an error response and returns { user: null }.
 */
const resolveUser = async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return { user: null };
  }

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return { user: null };
  }

  return { user };
};

/**
 * Recalculates the total price of a cart including side add-ons.
 */
const recalculateTotalPrice = (cart) => {
  return cart.products.reduce((sum, item) => {
    const sidesTotal = (item.sides || []).reduce((s, side) => s + side.side_price, 0);
    return sum + (item.price + sidesTotal) * item.quantity;
  }, 0);
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/v1/cart
 * Fetches the authenticated user's cart with populated product details.
 */
export const getCart = async (req, res) => {
  try {
    const { user } = await resolveUser(req, res);
    if (!user) return;

    const cart = await Cart.findOne({ user: user._id }).populate(
      "products.product",
      "productName productPrice productImage",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { products: [], totalPrice: 0 },
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

/**
 * POST /api/v1/cart
 * Adds a product to the cart. Creates a new cart if one doesn't exist.
 * Body: { productId, quantity?, sides? }
 * sides: [{ side_name, side_price, side_image? }]
 * Items with different side selections are stored as separate line items.
 */
export const addToCart = async (req, res) => {
  try {
    const { user } = await resolveUser(req, res);
    if (!user) return;

    const { productId, quantity = 1, sides = [] } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    // Validate product existence and grab its current price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Validate and resolve sides from the product's available sides
    const resolvedSides = [];
    if (sides && Array.isArray(sides) && sides.length > 0) {
      for (const sideName of sides) {
        const matched = product.side.find((s) => s.side_name === sideName);
        if (matched) {
          resolvedSides.push({
            side_name: matched.side_name,
            side_price: matched.side_price,
            side_image: matched.side_image || "",
          });
        }
      }
    }

    // Helper to compare two side selections (order-insensitive)
    const sidesMatch = (a, b) => {
      if (a.length !== b.length) return false;
      const namesA = a.map((s) => s.side_name).sort();
      const namesB = b.map((s) => s.side_name).sort();
      return namesA.every((name, i) => name === namesB[i]);
    };

    let cart = await Cart.findOne({ user: user._id });

    const newItem = {
      product: productId,
      quantity,
      price: product.productPrice,
      sides: resolvedSides,
    };

    if (!cart) {
      const sidesTotal = resolvedSides.reduce((s, side) => s + side.side_price, 0);
      cart = new Cart({
        user: user._id,
        products: [newItem],
        totalPrice: (product.productPrice + sidesTotal) * quantity,
      });
    } else {
      // Match by productId AND identical side selection
      const existingItem = cart.products.find(
        (item) =>
          item.product.toString() === productId &&
          sidesMatch(item.sides || [], resolvedSides),
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.products.push(newItem);
      }

      cart.totalPrice = recalculateTotalPrice(cart);
    }

    await cart.save();

    // Re-fetch with populated fields for the response
    const populatedCart = await Cart.findById(cart._id).populate(
      "products.product",
      "productName productPrice productImage",
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

/**
 * PUT /api/v1/cart
 * Updates the quantity of a specific product in the cart.
 * Body: { productId, quantity }
 * If quantity <= 0 the item is removed.
 */
export const updateCartItem = async (req, res) => {
  try {
    const { user } = await resolveUser(req, res);
    if (!user) return;

    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "productId and quantity are required" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    if (quantity <= 0) {
      // Remove the item
      cart.products.splice(itemIndex, 1);
    } else {
      cart.products[itemIndex].quantity = quantity;
    }

    cart.totalPrice = recalculateTotalPrice(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "products.product",
      "productName productPrice productImage",
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/v1/cart/:productId
 * Removes a single product from the cart.
 */
export const removeFromCart = async (req, res) => {
  try {
    const { user } = await resolveUser(req, res);
    if (!user) return;

    const { productId } = req.params;

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId,
    );

    if (cart.products.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    cart.totalPrice = recalculateTotalPrice(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "products.product",
      "productName productPrice productImage",
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/v1/cart
 * Clears all items from the cart.
 */
export const clearCart = async (req, res) => {
  try {
    const { user } = await resolveUser(req, res);
    if (!user) return;

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
