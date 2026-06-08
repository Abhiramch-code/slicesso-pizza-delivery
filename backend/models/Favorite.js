const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Favorite name is required'],
    trim: true,
  },
  base: { type: String, required: true },
  sauce: { type: String, required: true },
  cheese: { type: String, required: true },
  veggies: [String],
  meat: [String],
  price: { type: Number, required: true },
}, {
  timestamps: true,
});

favoriteSchema.index({ user: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
