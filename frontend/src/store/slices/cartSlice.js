import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage for persistence
const loadCartFromStorage = () => {
  try {
    const serialized = localStorage.getItem('cart');
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
  }
  return { items: [], totalAmount: 0 };
};

const saveCartToStorage = (state) => {
  try {
    const serialized = JSON.stringify({ items: state.items, totalAmount: state.totalAmount });
    localStorage.setItem('cart', serialized);
  } catch (e) {
    console.error('Failed to save cart to storage:', e);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      state.totalAmount += action.payload.price * (action.payload.quantity || 1);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const index = action.payload;
      const item = state.items[index];
      if (item) {
        state.totalAmount -= item.price * (item.quantity || 1);
        state.items.splice(index, 1);
        saveCartToStorage(state);
      }
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      const item = state.items[index];
      if (item) {
        state.totalAmount -= item.price * (item.quantity || 1);
        item.quantity = quantity;
        state.totalAmount += item.price * quantity;
        saveCartToStorage(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;