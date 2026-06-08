const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save a favorite pizza
// @route   POST /api/favorites
exports.saveFavorite = async (req, res) => {
  try {
    const { name, base, sauce, cheese, veggies, meat, price } = req.body;

    const favorite = await Favorite.create({
      user: req.user._id,
      name,
      base,
      sauce,
      cheese,
      veggies: veggies || [],
      meat: meat || [],
      price,
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a favorite
// @route   DELETE /api/favorites/:id
exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ _id: req.params.id, user: req.user._id });
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }
    await favorite.deleteOne();
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
