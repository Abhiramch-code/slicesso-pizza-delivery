# Slices - Seeding Guide

## Overview
The seeder script populates MongoDB with initial data required for the application to function.

## Running the Seeder
```bash
cd backend
npm run seed
```

## What Gets Seeded

### Inventory Items (25 items)
All pizza ingredients across 5 categories:

**Pizza Bases (5)**:
- Thin Crust, Thick Crust, Stuffed Crust, Cheese Burst, Whole Wheat

**Sauces (5)**:
- Tomato Basil, BBQ, Pesto, Garlic Parmesan, Arrabbiata

**Cheese (4)**:
- Mozzarella, Cheddar, Parmesan, Mixed

**Veggies (8)**:
- Onion, Capsicum, Tomato, Mushroom, Corn, Olive, Jalapeno, Paneer

**Meat (4)**:
- Chicken, Pepperoni, Sausage, Bacon

Each inventory item has:
- `name`: Display name
- `category`: base | sauce | cheese | veggie | meat
- `quantity`: Starting stock (100/50/30/20)
- `unit`: pcs | L | kg
- `threshold`: Low stock alert threshold
- `unitCost`: Cost per unit in INR

### Default Users (2)

**Admin User**:
- Email: admin@slicesso.com
- Password: admin123
- Role: admin
- isVerified: true

**Test User**:
- Email: test@slicesso.com
- Password: test123
- Role: user
- isVerified: true

## Important Notes
- The seeder **clears all existing data** before inserting (Inventory and Users collections)
- Admin password hashing is handled by the User model pre-save hook
- The seeder exits automatically after completion
- Run the seeder again anytime to reset data

## Extending the Seeder
To add more inventory items, edit `backend/seeder.js` and add entries to the `ingredients` array following the schema:
```javascript
{ name: 'Item Name', category: 'base|sauce|cheese|veggie|meat', quantity: 100, unit: 'pcs', threshold: 20, unitCost: 50 }
```