// controllers/cartController.js
import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// ✅ Get Cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price',
    strictPopulate: false,
  });

  if (!cart) {
    return res.status(200).json({ items: [] });
  }

  res.json(cart);
});

// ✅ Add or Update Cart Item
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // 1️⃣ Validate Product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('❌ Product not found');
  }

  // 2️⃣ Get or Create Cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // 3️⃣ Check if product is already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // ✅ Update quantity (NOT add)
    cart.items[itemIndex].quantity = quantity;
  } else {
    // ✅ Add new item
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json({ message: '🛒 Cart updated', cart });
});

// ✅ Remove Item from Cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('❌ Cart not found');
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === initialLength) {
    res.status(404);
    throw new Error('❌ Product not found in cart');
  }

  await cart.save();
  res.json({ message: '🗑️ Item removed from cart', cart });
});

// ✅ Clear Entire Cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('❌ Cart not found');
  }

  cart.items = [];
  await cart.save();
  res.json({ message: '🛒 Cart cleared', cart });
});
