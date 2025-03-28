import { createSlice } from '@reduxjs/toolkit';

// 🔹 Helper functions for local storage
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null; // ✅ Handle invalid JSON
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    localStorage.removeItem(key); // ✅ Remove corrupted data
    return null; // ✅ Fallback to null
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};

const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage`, error);
  }
};

// 🔹 Check if token is expired
const isTokenValid = () => {
  const expiryTime = loadFromStorage('tokenExpiry');
  return expiryTime && new Date().getTime() < expiryTime;
};

// 🔹 Initial state
const initialState = {
  userInfo: loadFromStorage('userInfo'),
  token: isTokenValid() ? loadFromStorage('token') : null,
  isAuthenticated: isTokenValid(),
};

// 🔹 Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ Set Credentials (Login)
    setCredentials: (state, action) => {
      const { user, token, expiresIn } = action.payload;
      state.userInfo = user;
      state.token = token;
      state.isAuthenticated = true;

      saveToStorage('userInfo', user);
      saveToStorage('token', token);

      // Token Expiry Handling
      if (expiresIn) {
        const expiryTime = new Date().getTime() + expiresIn * 1000;
        saveToStorage('tokenExpiry', expiryTime);
      }
    },

    // ✅ Logout User
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;

      removeFromStorage('userInfo');
      removeFromStorage('token');
      removeFromStorage('tokenExpiry');
    },

    // ✅ Auto Logout on Token Expiry
    checkTokenExpiry: (state) => {
      if (!isTokenValid()) {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;

        removeFromStorage('userInfo');
        removeFromStorage('token');
        removeFromStorage('tokenExpiry');
      }
    },
  },
});

// 🔹 Export Actions
export const { setCredentials, logout, checkTokenExpiry } = authSlice.actions;

// 🔹 Export Reducer
export default authSlice.reducer;
