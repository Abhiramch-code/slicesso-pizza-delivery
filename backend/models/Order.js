const mongoose = require('mongoose');

const pizzaItemSchema = new mongoose.Schema({
  // Pizza builder fields (optional for menu items)
  base: { type: String, required: false },
  sauce: { type: String, required: false },
  cheese: { type: String, required: false },
  veggies: [String],
  meat: [String],
  // Menu item fields
  name: { type: String, required: false },
  category: { type: String, required: false },
  isMenuItem: { type: Boolean, default: false },
  menuItemId: { type: String, required: false },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [pizzaItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['ORDER_RECEIVED', 'IN_KITCHEN', 'SENT_TO_DELIVERY', 'DELIVERED'],
    default: 'ORDER_RECEIVED',
  },
  paymentId: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  estimatedDelivery: Date,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

// Add initial status to history on create
orderSchema.pre('save', function () {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
