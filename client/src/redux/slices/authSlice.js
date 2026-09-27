// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    customer: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isLoggedIn', 'true');
      }
    },

    clearCustomer: (state) => {
      state.customer = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    updateCustomer: (state, action) => {
      state.customer = { ...state.customer, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.customer));
    },
  },
});

export const {
  setCustomer,
  clearCustomer,
  setLoading,
  setError,
  clearError,
  updateCustomer,
} = authSlice.actions;

// Selectors
export const selectCustomer = (state) => state.auth.customer;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;