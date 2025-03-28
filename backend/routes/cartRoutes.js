import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

// ✅ Get Cart & Add to Cart
router.route('/')
    .get(protect, getCart)  // ✅ Get user's cart
    .post(protect, addToCart); // ✅ Add product to cart

// ✅ Remove single product from cart (product ID in params)
router.route('/remove/:productId').delete(protect, removeFromCart);

// ✅ Clear entire cart
router.route('/clear').delete(protect, clearCart);

export default router;
