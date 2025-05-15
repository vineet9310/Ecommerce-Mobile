import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js'; // Make sure your Order model is correctly imported

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments(); // Or based on specific criteria

    // Calculate total revenue from paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Could not fetch admin statistics: ' + error.message);
  }
});

export { getAdminStats };