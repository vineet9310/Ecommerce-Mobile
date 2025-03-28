import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const getCart = asyncHandler(async (req, res) => {
  // Fetch the user's cart and populate the `product` field inside `items`
  const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product', // ✅ Populate product details
      select: 'name price', // ✅ Only fetch specific fields
      strictPopulate: false // ✅ Prevent strict population error
  });

  if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty cart if not found
  }

  res.json(cart);
});



// ✅ Add Item to Cart
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    // 1️⃣ Validate Product
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('❌ Product not found');
    }

    // 2️⃣ Check if Cart Exists
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    // 3️⃣ Ensure `items` is an array
    if (!cart.items) cart.items = [];

    // 4️⃣ Check if product exists in cart & update quantity
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: '🛒 Item added to cart', cart });
});

// ✅ Remove Item from Cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const productId = req.params.productId; // Use `productId` instead of `id`
    
    // 1️⃣ Find Cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('❌ Cart not found');
    }

    // 2️⃣ Filter out item
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    if (cart.items.length === initialLength) {
        res.status(404);
        throw new Error('❌ Product not found in cart');
    }

    await cart.save();
    res.json({ message: '🗑️ Item removed from cart', cart });
});

// ✅ Clear Cart
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
