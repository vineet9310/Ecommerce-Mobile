import { createSlice } from '@reduxjs/toolkit';

// 🔹 Helper functions for local storage
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
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

// 🔹 Initialize Auth State from Storage
const getInitialAuthState = () => {
  const token = loadFromStorage('token');
  const userInfo = loadFromStorage('userInfo');
  const valid = isTokenValid();

  return {
    userInfo: valid ? userInfo : null,
    token: valid ? token : null,
    isAuthenticated: valid,
  };
};

// 🔹 Initial State
const initialState = getInitialAuthState();

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

    // ✅ Auto Logout if token expired
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
