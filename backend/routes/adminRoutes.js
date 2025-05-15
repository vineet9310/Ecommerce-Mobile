// Example in adminRoutes.js
import express from 'express';
const router = express.Router();
import { getAdminStats } from '../controllers/adminController.js'; // Adjust path
import { protect, admin } from '../middleware/authMiddleware.js'; // Adjust path

router.get('/stats', protect, admin, getAdminStats);

export default router;

// Then in your main server.js:
// import adminRoutes from './routes/adminRoutes.js'; // Adjust path
// app.use('/api/admin', adminRoutes);