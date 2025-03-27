import { createSlice } from '@reduxjs/toolkit';

// Safe localStorage parsing
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data && data !== 'undefined' ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return null;
  }
};

const initialState = {
  userInfo: loadFromStorage('userInfo'),
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.userInfo = user;
      state.token = token;

      try {
        if (user) localStorage.setItem('userInfo', JSON.stringify(user));
        if (token) localStorage.setItem('token', token);
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;

      try {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Error removing from localStorage', error);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
