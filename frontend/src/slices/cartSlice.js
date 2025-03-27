import { createSlice } from '@reduxjs/toolkit';

// Helper function to update localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Load cart from localStorage safely
const loadCartFromStorage = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart'));
    return cart ? cart : { cartItems: [], itemsPrice: 0, shippingPrice: 0, totalPrice: 0 };
  } catch (error) {
    return { cartItems: [], itemsPrice: 0, shippingPrice: 0, totalPrice: 0 };
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      // Calculate prices
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      state.totalPrice = state.itemsPrice + state.shippingPrice;

      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Calculate prices
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      state.totalPrice = state.itemsPrice + state.shippingPrice;

      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
