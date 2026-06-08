const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/').get(getAllMenuItems);
router.route('/:id').get(getMenuItemById);

// Admin routes
router.route('/').post(protect, authorize('admin'), createMenuItem);
router.route('/:id').put(protect, authorize('admin'), updateMenuItem);
router.route('/:id').delete(protect, authorize('admin'), deleteMenuItem);

module.exports = router;
