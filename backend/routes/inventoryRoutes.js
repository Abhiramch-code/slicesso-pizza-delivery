const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  restockItem,
  getTransactions,
  getAnalytics,
  getForecast,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

// All inventory routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/transactions', getTransactions);
router.get('/analytics', getAnalytics);
router.get('/forecast', getForecast);

router.route('/')
  .get(getInventory)
  .post(createInventoryItem);

router.route('/:id')
  .get(getInventoryItem)
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

router.put('/:id/restock', restockItem);

module.exports = router;
