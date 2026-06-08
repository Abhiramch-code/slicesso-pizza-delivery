const Coupon = require('../models/Coupon');

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create coupon (admin)
// @route   POST /api/coupons
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, minOrderAmount, maxUses } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || null,
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle coupon active status (admin)
// @route   PUT /api/coupons/:id/toggle
exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    coupon.active = !coupon.active;
    await coupon.save();
    res.json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate coupon (user)
// @route   POST /api/coupons/validate
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.active) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, orderAmount);
    const finalAmount = orderAmount - discount;

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
