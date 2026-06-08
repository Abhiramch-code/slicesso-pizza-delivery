const express = require('express');
const router = express.Router();
const {
  getFavorites,
  saveFavorite,
  deleteFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFavorites);
router.post('/', saveFavorite);
router.delete('/:id', deleteFavorite);

module.exports = router;
