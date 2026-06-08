import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import pizzaBuilderReducer from './slices/pizzaBuilderSlice';
import orderReducer from './slices/orderSlice';
import inventoryReducer from './slices/inventorySlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    pizzaBuilder: pizzaBuilderReducer,
    orders: orderReducer,
    inventory: inventoryReducer,
    notifications: notificationReducer,
  },
  devTools: true,
});