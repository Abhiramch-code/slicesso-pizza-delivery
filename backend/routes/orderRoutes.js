const express = require('express');
const router = express.Router();
const {
  getPricing,
  calculatePrice,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.get('/pricing', getPricing);
router.post('/calculate', calculatePrice);

// Protected routes
router.use(protect);

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
