import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (category, thunkAPI) => {
  try {
    const { data } = await api.get('/inventory', { params: { category } });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch inventory' });
  }
});

export const createInventoryItem = createAsyncThunk('inventory/createItem', async (itemData, thunkAPI) => {
  try {
    const { data } = await api.post('/inventory', itemData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to create item' });
  }
});

export const updateInventoryItem = createAsyncThunk('inventory/updateItem', async ({ id, data }, thunkAPI) => {
  try {
    const { data: response } = await api.put(`/inventory/${id}`, data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to update item' });
  }
});

export const deleteInventoryItem = createAsyncThunk('inventory/deleteItem', async (id, thunkAPI) => {
  try {
    await api.delete(`/inventory/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to delete item' });
  }
});

export const restockItem = createAsyncThunk('inventory/restockItem', async ({ id, quantity, note }, thunkAPI) => {
  try {
    const { data } = await api.put(`/inventory/${id}/restock`, { quantity, note });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to restock' });
  }
});

export const fetchInventoryAnalytics = createAsyncThunk('inventory/fetchAnalytics', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/inventory/analytics');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch analytics' });
  }
});

const initialState = {
  items: [],
  stats: { total: 0, lowStock: 0, totalValue: 0 },
  analytics: null,
  isLoading: false,
  error: null,
  editingItem: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setEditingItem: (state, action) => { state.editingItem = action.payload; },
    clearInventoryError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.isLoading = true; })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.stats = action.payload.stats;
      })
      .addCase(fetchInventory.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message; })
      .addCase(createInventoryItem.fulfilled, (state, action) => { state.items.push(action.payload.item); })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.map(i => i._id === action.payload.item._id ? action.payload.item : i);
        state.editingItem = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      })
      .addCase(restockItem.fulfilled, (state, action) => {
        state.items = state.items.map(i => i._id === action.payload.item._id ? action.payload.item : i);
      })
      .addCase(fetchInventoryAnalytics.fulfilled, (state, action) => { state.analytics = action.payload.analytics; });
  },
});

export const { setEditingItem, clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;