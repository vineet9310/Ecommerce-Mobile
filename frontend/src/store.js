import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import { cartApiSlice } from './slices/cartApiSlice';
import { cartSliceReducer } from './slices/cartSlice'; // ✅ Changed to named import
import authSliceReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [cartApiSlice.reducerPath]: cartApiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, cartApiSlice.middleware),
  devTools: import.meta.env.MODE !== 'production',  // ✅ Fix: Works better with Vite
});

export default store;
