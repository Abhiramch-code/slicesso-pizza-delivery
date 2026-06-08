const crypto = require('crypto');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const InventoryTransaction = require('../models/InventoryTransaction');
const Notification = require('../models/Notification');
const getRazorpayInstance = require('../config/razorpay');

// Pricing configuration
const PRICING = {
  base: {
    'Thin Crust': 200,
    'Thick Crust': 250,
    'Cheese Burst': 350,
    'Whole Wheat': 220,
    'Stuffed Crust': 300,
  },
  sauce: {
    'Tomato Basil': 30,
    'BBQ': 40,
    'Pesto': 50,
    'Garlic Parmesan': 45,
    'Arrabbiata': 35,
  },
  cheese: {
    'Mozzarella': 60,
    'Cheddar': 70,
    'Parmesan': 80,
    'Mixed': 90,
  },
  veggie: {
    'Onion': 20,
    'Capsicum': 20,
    'Tomato': 15,
    'Mushroom': 30,
    'Corn': 20,
    'Olive': 35,
    'Jalapeno': 25,
    'Paneer': 50,
  },
  meat: {
    'Chicken': 60,
    'Pepperoni': 70,
    'Sausage': 65,
    'Bacon': 75,
  },
};

// Calculate price for a single pizza
const calculatePizzaPrice = (item) => {
  let price = 0;
  price += PRICING.base[item.base] || 200;
  price += PRICING.sauce[item.sauce] || 30;
  price += PRICING.cheese[item.cheese] || 60;
  if (item.veggies) {
    item.veggies.forEach(v => { price += PRICING.veggie[v] || 20; });
  }
  if (item.meat) {
    item.meat.forEach(m => { price += PRICING.meat[m] || 60; });
  }
  return price * (item.quantity || 1);
};

// Deduct inventory for an order
const deductInventory = async (items, orderId) => {
  for (const item of items) {
    const deductions = [
      { name: item.base, category: 'base', qty: 0.3 * item.quantity },
      { name: item.sauce, category: 'sauce', qty: 0.1 * item.quantity },
      { name: item.cheese, category: 'cheese', qty: 0.15 * item.quantity },
    ];

    if (item.veggies) {
      item.veggies.forEach(v => deductions.push({ name: v, category: 'veggie', qty: 0.05 * item.quantity }));
    }
    if (item.meat) {
      item.meat.forEach(m => deductions.push({ name: m, category: 'meat', qty: 0.08 * item.quantity }));
    }

    for (const ded of deductions) {
      const invItem = await Inventory.findOne({ name: ded.name, category: ded.category });
      if (invItem) {
        invItem.quantity = Math.max(0, invItem.quantity - ded.qty);
        await invItem.save();
        await InventoryTransaction.create({
          inventoryItem: invItem._id,
          type: 'deduction',
          quantity: ded.qty,
          order: orderId,
          note: `Order ${orderId} - ${ded.name}`,
        });
      }
    }
  }
};

// @desc    Get pizza pricing config
// @route   GET /api/orders/pricing
exports.getPricing = (req, res) => {
  res.json({ success: true, pricing: PRICING });
};

// @desc    Calculate price for cart
// @route   POST /api/orders/calculate
exports.calculatePrice = (req, res) => {
  try {
    const { items } = req.body;
    let total = 0;
    const pricedItems = items.map(item => {
      const price = calculatePizzaPrice(item);
      total += price;
      return { ...item, price };
    });
    res.json({ success: true, items: pricedItems, totalAmount: total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Razorpay order (with mock fallback)
// @route   POST /api/orders/create-razorpay-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let totalAmount = 0;
    const pricedItems = items.map(item => {
      const price = calculatePizzaPrice(item);
      totalAmount += price;
      return { ...item, price };
    });

    // Check if Razorpay keys are placeholder/missing (mock mode)
    const isMockMode = !process.env.RAZORPAY_KEY_ID || 
      process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' ||
      process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_placeholder');

    if (isMockMode) {
      // Mock payment mode for development
      const mockOrderId = `mock_order_${Date.now()}`;
      return res.json({
        success: true,
        mockMode: true,
        razorpayOrder: {
          id: mockOrderId,
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: mockOrderId,
          status: 'created',
        },
        items: pricedItems,
        totalAmount,
        key: 'mock_key',
      });
    }

    // Real Razorpay mode
    const razorpay = getRazorpayInstance();
    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      mockMode: false,
      razorpayOrder,
      items: pricedItems,
      totalAmount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify payment and create order (with mock fallback)
// @route   POST /api/orders/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, deliveryAddress, mockMode } = req.body;

    // Calculate total
    let totalAmount = 0;
    const pricedItems = items.map(item => {
      const price = calculatePizzaPrice(item);
      totalAmount += price;
      return { ...item, price };
    });

    // Mock payment verification
    if (mockMode || razorpay_order_id?.startsWith('mock_order_')) {
      const mockPaymentId = `mock_pay_${Date.now()}`;
      
      const order = await Order.create({
        user: req.user._id,
        items: pricedItems,
        totalAmount,
        paymentId: mockPaymentId,
        razorpayOrderId: razorpay_order_id || `mock_order_${Date.now()}`,
        razorpaySignature: 'mock_signature',
        paymentStatus: 'completed',
        deliveryAddress: deliveryAddress || { street: '123 Test St', city: 'Test City', state: 'TS', zip: '12345' },
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
      });

      // Deduct inventory
      await deductInventory(pricedItems, order._id);

      // Create notification
      await Notification.create({
        user: req.user._id,
        type: 'payment_success',
        title: 'Order Placed Successfully',
        message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been placed. Total: ₹${totalAmount}`,
        data: { orderId: order._id },
      });

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.emit('new-order', { orderId: order._id, status: order.status });
        io.to(`user_${req.user._id}`).emit('order-update', order);
      }

      return res.status(201).json({ success: true, order, mockMode: true });
    }

    // Real Razorpay verification
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.create({
      user: req.user._id,
      items: pricedItems,
      totalAmount,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'completed',
      deliveryAddress,
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
    });

    // Deduct inventory
    await deductInventory(pricedItems, order._id);

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'payment_success',
      title: 'Order Placed Successfully',
      message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been placed. Total: ₹${totalAmount}`,
      data: { orderId: order._id },
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('new-order', { orderId: order._id, status: order.status });
      io.to(`user_${req.user._id}`).emit('order-update', order);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({ success: true, orders, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['ORDER_RECEIVED', 'IN_KITCHEN', 'SENT_TO_DELIVERY', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save();

    // Create notification for user
    const statusLabels = {
      ORDER_RECEIVED: 'Order Received',
      IN_KITCHEN: 'Being Prepared',
      SENT_TO_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
    };

    await Notification.create({
      user: order.user,
      type: 'order_update',
      title: `Order Update: ${statusLabels[status]}`,
      message: `Your order #${order._id.toString().slice(-8).toUpperCase()} status has been updated to ${statusLabels[status]}.`,
      data: { orderId: order._id, status },
    });

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('order-status-update', { orderId: order._id, status });
      io.to(`user_${order.user}`).emit('order-update', order);
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};