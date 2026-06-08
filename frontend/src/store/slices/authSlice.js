import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    if (data.accessToken) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Login failed' });
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    if (data.accessToken) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Registration failed' });
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/verify-email', { token });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Verification failed' });
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to send reset email' });
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Reset failed' });
  }
});

export const getUserProfile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to get profile' });
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, thunkAPI) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Update failed' });
  }
});

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  isAuthenticated: !!user,
  isLoading: false,
  error: null,
  verificationSent: false,
  resetSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.isAuthenticated = true; state.user = action.payload.user; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message || 'Login failed'; })
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.isLoading = false; state.isAuthenticated = true; state.user = action.payload.user; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message || 'Registration failed'; })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => { state.isLoading = true; })
      .addCase(verifyEmail.fulfilled, (state) => { state.isLoading = false; if (state.user) { state.user.isVerified = true; localStorage.setItem('user', JSON.stringify(state.user)); } })
      .addCase(verifyEmail.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message; })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
      .addCase(forgotPassword.fulfilled, (state) => { state.isLoading = false; state.resetSent = true; })
      .addCase(forgotPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message; })
      // Reset Password
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
      .addCase(resetPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(resetPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message; })
      // Get Profile
      .addCase(getUserProfile.fulfilled, (state, action) => { state.user = action.payload.user; localStorage.setItem('user', JSON.stringify(action.payload.user)); })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;