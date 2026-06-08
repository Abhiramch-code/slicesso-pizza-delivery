const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// unique: true on code field already creates an index
couponSchema.index({ active: 1, expiryDate: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
