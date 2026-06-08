const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  type: {
    type: String,
    enum: ['deduction', 'restock', 'adjustment'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  note: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
