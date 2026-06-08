const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  unit: {
    type: String,
    default: 'kg',
  },
  threshold: {
    type: Number,
    required: true,
    default: 10,
  },
  unitCost: {
    type: Number,
    required: true,
    default: 0,
  },
  supplier: {
    type: String,
    default: '',
  },
  lastAlertSent: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Virtual to check if stock is low
inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.threshold;
});

// Virtual to check if stock is critical
inventorySchema.virtual('isCritical').get(function () {
  return this.quantity <= this.threshold * 0.5;
});

inventorySchema.index({ category: 1, name: 1 });
inventorySchema.index({ quantity: 1 });

inventorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);
