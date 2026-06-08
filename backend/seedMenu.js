require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const connectDB = require('./config/db');

// Menu items data
const menuItems = [
  // Popular Pizzas
  {
    name: 'Margherita',
    category: 'pizza',
    description: 'Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil',
    price: 350,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Thin Crust',
      sauce: 'Tomato Basil',
      cheese: 'Mozzarella',
      veggies: ['Tomato'],
      meat: []
    },
    isPopular: true,
    isAvailable: true,
    preparationTime: 15
  },
  {
    name: 'Farmhouse',
    category: 'pizza',
    description: 'Loaded with fresh veggies - onion, capsicum, tomato, mushroom, and corn',
    price: 420,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Thin Crust',
      sauce: 'Tomato Basil',
      cheese: 'Mozzarella',
      veggies: ['Onion', 'Capsicum', 'Tomato', 'Mushroom', 'Corn'],
      meat: []
    },
    isPopular: true,
    isAvailable: true,
    preparationTime: 18
  },
  {
    name: 'Veg Supreme',
    category: 'pizza',
    description: 'The ultimate veggie delight with capsicum, onion, tomato, mushroom, olive, and jalapeno',
    price: 450,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Thin Crust',
      sauce: 'Tomato Basil',
      cheese: 'Mozzarella',
      veggies: ['Capsicum', 'Onion', 'Tomato', 'Mushroom', 'Olive', 'Jalapeno'],
      meat: []
    },
    isPopular: true,
    isAvailable: true,
    preparationTime: 18
  },
  {
    name: 'Pepperoni Feast',
    category: 'pizza',
    description: 'Loaded with spicy pepperoni and extra cheese',
    price: 480,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Thin Crust',
      sauce: 'Tomato Basil',
      cheese: 'Mozzarella',
      veggies: [],
      meat: ['Pepperoni']
    },
    isPopular: true,
    isAvailable: true,
    preparationTime: 16
  },
  {
    name: 'Chicken Dominator',
    category: 'pizza',
    description: 'Double chicken with pepperoni, sausage, and BBQ sauce',
    price: 520,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Thick Crust',
      sauce: 'BBQ',
      cheese: 'Mozzarella',
      veggies: ['Onion', 'Capsicum'],
      meat: ['Chicken', 'Pepperoni', 'Sausage']
    },
    isPopular: true,
    isAvailable: true,
    preparationTime: 20
  },
  {
    name: 'Cheese Burst',
    category: 'pizza',
    description: 'Mozzarella filled crust with extra cheese topping',
    price: 400,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Cheese Burst',
      sauce: 'Tomato Basil',
      cheese: 'Mozzarella',
      veggies: [],
      meat: []
    },
    isPopular: false,
    isAvailable: true,
    preparationTime: 16
  },
  {
    name: 'BBQ Chicken',
    category: 'pizza',
    description: 'Grilled chicken with BBQ sauce, onion, and capsicum',
    price: 460,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop',
    ingredients: {
      base: 'Thin Crust',
      sauce: 'BBQ',
      cheese: 'Mozzarella',
      veggies: ['Onion', 'Capsicum'],
      meat: ['Chicken']
    },
    isPopular: false,
    isAvailable: true,
    preparationTime: 18
  },

  // Sides
  {
    name: 'Garlic Bread',
    category: 'side',
    description: 'Crispy bread with garlic butter and herbs',
    price: 120,
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 8
  },
  {
    name: 'Cheesy Breadsticks',
    category: 'side',
    description: 'Golden breadsticks topped with melted mozzarella',
    price: 150,
    image: 'https://images.unsplash.com/photo-1573140401552-167fab0e0bee?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 10
  },
  {
    name: 'Chicken Wings',
    category: 'side',
    description: 'Crispy chicken wings with your choice of sauce',
    price: 280,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 15
  },
  {
    name: 'French Fries',
    category: 'side',
    description: 'Classic crispy golden fries with seasoning',
    price: 100,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 8
  },
  {
    name: 'Onion Rings',
    category: 'side',
    description: 'Crispy battered onion rings',
    price: 110,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 10
  },

  // Drinks
  {
    name: 'Coke',
    category: 'drink',
    description: 'Classic Coca-Cola 500ml',
    price: 60,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 2
  },
  {
    name: 'Pepsi',
    category: 'drink',
    description: 'Pepsi 500ml',
    price: 60,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 2
  },
  {
    name: 'Sprite',
    category: 'drink',
    description: 'Refreshing lemon-lime soda 500ml',
    price: 60,
    image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 2
  },
  {
    name: 'Water',
    category: 'drink',
    description: 'Mineral water 500ml',
    price: 40,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 1
  },
  {
    name: 'Fresh Lime Soda',
    category: 'drink',
    description: 'Fresh lime with soda and mint',
    price: 80,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 5
  },

  // Desserts
  {
    name: 'Chocolate Lava Cake',
    category: 'dessert',
    description: 'Warm chocolate cake with molten center',
    price: 180,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 12
  },
  {
    name: 'Brownie',
    category: 'dessert',
    description: 'Fudgy chocolate brownie with vanilla ice cream',
    price: 150,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    preparationTime: 8
  },
  {
    name: 'Ice Cream',
    category: 'dessert',
    description: 'Creamy vanilla ice cream',
    price: 100,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 3
  },
  {
    name: 'Tiramisu',
    category: 'dessert',
    description: 'Classic Italian dessert with espresso and mascarpone',
    price: 200,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 10
  },
  {
    name: 'Cheesecake',
    category: 'dessert',
    description: 'New York style cheesecake with berry compote',
    price: 190,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    preparationTime: 10
  }
];

const seedMenu = async () => {
  try {
    await connectDB();
    
    // Clear existing menu items
    await MenuItem.deleteMany();
    console.log('Existing menu items cleared');
    
    // Insert new menu items
    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully!');
    
    console.log(`Total menu items: ${menuItems.length}`);
    console.log(`Pizzas: ${menuItems.filter(i => i.category === 'pizza').length}`);
    console.log(`Sides: ${menuItems.filter(i => i.category === 'side').length}`);
    console.log(`Drinks: ${menuItems.filter(i => i.category === 'drink').length}`);
    console.log(`Desserts: ${menuItems.filter(i => i.category === 'dessert').length}`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding menu:', error);
    process.exit(1);
  }
};

seedMenu();
