const Inventory = require('../models/Inventory');
const InventoryTransaction = require('../models/InventoryTransaction');
const Order = require('../models/Order');

// @desc    Get all inventory items
// @route   GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const items = await Inventory.find(query).sort('category name');
    const lowStockCount = items.filter(i => i.quantity <= i.threshold).length;

    res.json({
      success: true,
      items,
      stats: {
        total: items.length,
        lowStock: lowStockCount,
        totalValue: items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
exports.getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
exports.createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restock inventory item
// @route   PUT /api/inventory/:id/restock
exports.restockItem = async (req, res) => {
  try {
    const { quantity, note } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    item.quantity += quantity;
    await item.save();

    await InventoryTransaction.create({
      inventoryItem: item._id,
      type: 'restock',
      quantity,
      note: note || `Restocked ${quantity} ${item.unit}`,
    });

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inventory transactions
// @route   GET /api/inventory/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const transactions = await InventoryTransaction.find()
      .populate('inventoryItem', 'name category')
      .populate('order', 'status totalAmount')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await InventoryTransaction.countDocuments();

    res.json({ success: true, transactions, total, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inventory analytics
// @route   GET /api/inventory/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const items = await Inventory.find();
    const lowStockItems = items.filter(i => i.quantity <= i.threshold);
    const criticalItems = items.filter(i => i.quantity <= i.threshold * 0.5);

    const categoryBreakdown = {};
    items.forEach(item => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = { count: 0, totalValue: 0, lowStock: 0 };
      }
      categoryBreakdown[item.category].count++;
      categoryBreakdown[item.category].totalValue += item.quantity * item.unitCost;
      if (item.quantity <= item.threshold) categoryBreakdown[item.category].lowStock++;
    });

    res.json({
      success: true,
      analytics: {
        totalItems: items.length,
        lowStockCount: lowStockItems.length,
        criticalCount: criticalItems.length,
        totalInventoryValue: items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0),
        categoryBreakdown,
        lowStockItems: lowStockItems.map(i => ({ id: i._id, name: i.name, category: i.category, quantity: i.quantity, threshold: i.threshold })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inventory forecast
// @route   GET /api/inventory/forecast
exports.getForecast = async (req, res) => {
  try {
    const items = await Inventory.find();

    // Get deduction transactions from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deductions = await InventoryTransaction.find({
      type: 'deduction',
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Calculate average daily usage per inventory item
    const usageMap = {};
    deductions.forEach(tx => {
      const itemId = tx.inventoryItem.toString();
      if (!usageMap[itemId]) {
        usageMap[itemId] = 0;
      }
      usageMap[itemId] += tx.quantity;
    });

    const forecast = items.map(item => {
      const totalUsed = usageMap[item._id.toString()] || 0;
      const avgDailyUsage = totalUsed / 30;
      const daysRemaining = avgDailyUsage > 0 ? Math.floor(item.quantity / avgDailyUsage) : null;

      return {
        id: item._id,
        name: item.name,
        category: item.category,
        currentStock: item.quantity,
        unit: item.unit,
        avgDailyUsage: Math.round(avgDailyUsage * 100) / 100,
        daysRemaining,
        status: daysRemaining === null ? 'no_data' : daysRemaining <= 3 ? 'critical' : daysRemaining <= 7 ? 'low' : 'sufficient',
      };
    });

    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
