require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Coupon = require('./models/Coupon');

const ingredients = [
  // Pizza Bases
  { name: 'Thin Crust', category: 'base', quantity: 100, unit: 'pcs', threshold: 20, unitCost: 50 },
  { name: 'Thick Crust', category: 'base', quantity: 100, unit: 'pcs', threshold: 20, unitCost: 60 },
  { name: 'Stuffed Crust', category: 'base', quantity: 100, unit: 'pcs', threshold: 20, unitCost: 75 },
  { name: 'Cheese Burst', category: 'base', quantity: 100, unit: 'pcs', threshold: 20, unitCost: 85 },
  { name: 'Whole Wheat', category: 'base', quantity: 100, unit: 'pcs', threshold: 20, unitCost: 55 },

  // Sauces
  { name: 'Tomato Basil', category: 'sauce', quantity: 50, unit: 'L', threshold: 10, unitCost: 30 },
  { name: 'BBQ', category: 'sauce', quantity: 50, unit: 'L', threshold: 10, unitCost: 35 },
  { name: 'Pesto', category: 'sauce', quantity: 50, unit: 'L', threshold: 10, unitCost: 45 },
  { name: 'Garlic Parmesan', category: 'sauce', quantity: 50, unit: 'L', threshold: 10, unitCost: 40 },
  { name: 'Arrabbiata', category: 'sauce', quantity: 50, unit: 'L', threshold: 10, unitCost: 32 },

  // Cheese
  { name: 'Mozzarella', category: 'cheese', quantity: 50, unit: 'kg', threshold: 15, unitCost: 200 },
  { name: 'Cheddar', category: 'cheese', quantity: 50, unit: 'kg', threshold: 15, unitCost: 220 },
  { name: 'Parmesan', category: 'cheese', quantity: 50, unit: 'kg', threshold: 15, unitCost: 280 },
  { name: 'Mixed', category: 'cheese', quantity: 50, unit: 'kg', threshold: 15, unitCost: 250 },

  // Veggies
  { name: 'Onion', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 30 },
  { name: 'Capsicum', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 40 },
  { name: 'Tomato', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 25 },
  { name: 'Mushroom', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 60 },
  { name: 'Corn', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 35 },
  { name: 'Olive', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 80 },
  { name: 'Jalapeno', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 50 },
  { name: 'Paneer', category: 'veggie', quantity: 30, unit: 'kg', threshold: 5, unitCost: 150 },

  // Meat
  { name: 'Chicken', category: 'meat', quantity: 20, unit: 'kg', threshold: 5, unitCost: 200 },
  { name: 'Pepperoni', category: 'meat', quantity: 20, unit: 'kg', threshold: 5, unitCost: 250 },
  { name: 'Sausage', category: 'meat', quantity: 20, unit: 'kg', threshold: 5, unitCost: 220 },
  { name: 'Bacon', category: 'meat', quantity: 20, unit: 'kg', threshold: 5, unitCost: 280 },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Inventory.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();
    console.log('Existing data cleared');

    // Insert inventory data
    await Inventory.insertMany(ingredients);
    console.log('Inventory seeded successfully');

    // Create default admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@slicesso.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });
    console.log('Admin user created:', admin.email);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@slicesso.com',
      password: 'test123',
      role: 'user',
      isVerified: true,
    });
    console.log('Test user created:', testUser.email);

    // Create sample coupons
    const coupons = await Coupon.insertMany([
      { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, active: true, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), minOrderAmount: 300 },
      { code: 'STUDENT15', discountType: 'percentage', discountValue: 15, active: true, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), minOrderAmount: 200 },
      { code: 'FREEDELIVERY', discountType: 'fixed', discountValue: 50, active: true, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), minOrderAmount: 0 },
    ]);
    console.log('Sample coupons created:', coupons.map(c => c.code).join(', '));

    console.log('\n=== Seeding Complete ===');
    console.log('Admin: admin@slicesso.com / admin123');
    console.log('User:  test@slicesso.com / test123');
    console.log('========================\n');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();