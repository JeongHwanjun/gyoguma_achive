// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId : null,
    userEmail : null,
    accessToken: null,
    refreshToken : null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.userEmail = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginSuccess, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
