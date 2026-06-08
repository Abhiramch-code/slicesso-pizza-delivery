import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/orders/my-orders');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch orders' });
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch order' });
  }
});

export const createRazorpayOrder = createAsyncThunk('orders/createRazorpayOrder', async (items, thunkAPI) => {
  try {
    const { data } = await api.post('/orders/create-razorpay-order', { items });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to create order' });
  }
});

export const verifyPayment = createAsyncThunk('orders/verifyPayment', async (paymentData, thunkAPI) => {
  try {
    const { data } = await api.post('/orders/verify-payment', paymentData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Payment verification failed' });
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (params, thunkAPI) => {
  try {
    const { data } = await api.get('/orders', { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch orders' });
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ id, status }, thunkAPI) => {
  try {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to update status' });
  }
});

export const fetchPricing = createAsyncThunk('orders/fetchPricing', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/orders/pricing');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const initialState = {
  orders: [],
  activeOrder: null,
  allOrders: [],
  pricing: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
    updateOrderFromSocket: (state, action) => {
      const updated = action.payload;
      state.orders = state.orders.map(o => o._id === updated._id ? updated : o);
      if (state.activeOrder?._id === updated._id) {
        state.activeOrder = updated;
      }
      state.allOrders = state.allOrders.map(o => o._id === updated._id ? updated : o);
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.isLoading = false; state.orders = action.payload.orders; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message; })
      .addCase(fetchAllOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.isLoading = false; state.allOrders = action.payload.orders; })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.order;
        state.allOrders = state.allOrders.map(o => o._id === updated._id ? updated : o);
      })
      .addCase(fetchPricing.fulfilled, (state, action) => { state.pricing = action.payload.pricing; })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.orders.unshift(action.payload.order);
        state.activeOrder = action.payload.order;
      });
  },
});

export const { setActiveOrder, updateOrderFromSocket, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;