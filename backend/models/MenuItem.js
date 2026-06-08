const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['pizza', 'side', 'drink', 'dessert'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    default: '',
  },
  // For pizzas - pre-configured ingredients
  ingredients: {
    base: String,
    sauce: String,
    cheese: String,
    veggies: [String],
    meat: [String],
  },
  // For all items
  isPopular: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number,
    default: 15, // in minutes
  },
}, {
  timestamps: true,
});

menuItemSchema.index({ category: 1, isPopular: -1 });
menuItemSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
