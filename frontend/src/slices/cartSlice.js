import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Async thunk for fetching cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/api/cart', {
      credentials: 'include', // ✅ Ensure cookies (JWT) are sent
    });

    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();

    return data.items || []; // ✅ Ensure `items` is always an array
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ✅ Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartItems: [], status: 'idle', error: null },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = []; // ✅ Empty cart handler
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartItems = action.payload.length ? action.payload : []; // ✅ Handle empty cart properly
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
