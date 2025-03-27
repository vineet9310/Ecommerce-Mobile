import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

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
        state.cartItems = [...state.cartItems, item];
      }

      // Calculate prices
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      state.totalPrice = state.itemsPrice + state.shippingPrice;

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
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

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
    loadCartFromStorage: (state) => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        state.cartItems = parsedCart.cartItems;
        state.itemsPrice = parsedCart.itemsPrice;
        state.shippingPrice = parsedCart.shippingPrice;
        state.totalPrice = parsedCart.totalPrice;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCartFromStorage } =
  cartSlice.actions;

export default cartSlice.reducer;