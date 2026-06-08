const express = require('express');
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
  validateCoupon,
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

// User route - validate coupon
router.post('/validate', protect, validateCoupon);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getCoupons);
router.post('/', createCoupon);
router.put('/:id/toggle', toggleCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
