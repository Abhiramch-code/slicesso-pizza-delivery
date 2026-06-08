const mongoose = require('mongoose');

const pizzaItemSchema = new mongoose.Schema({
  base: { type: String, required: true },
  sauce: { type: String, required: true },
  cheese: { type: String, required: true },
  veggies: [String],
  meat: [String],
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
