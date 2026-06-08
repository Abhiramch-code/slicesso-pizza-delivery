import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id, thunkAPI) => {
  try {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async (_, thunkAPI) => {
  try {
    await api.put('/notifications/mark-all-read');
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.isLoading = false;
      })
      .addCase(fetchNotifications.pending, (state) => { state.isLoading = true; })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map(n =>
          n._id === action.payload.notification._id ? { ...n, isRead: true } : n
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;