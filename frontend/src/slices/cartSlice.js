import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';

// ✅ Define cartSlice
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const cartApiSlice = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: '/cart',
        method: 'POST',
        body: cartData,
      }),
      invalidatesTags: ['Cart'],
    }),
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

// ✅ Export Hooks
export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} = cartApiSlice;

export const cartSliceReducer = cartSlice.reducer;
export const { setCartItems } = cartSlice.actions;

// ✅ Add and export fetchCart function
export const fetchCart = async () => {
  const response = await fetch('http://localhost:5000/api/cart');
  if (!response.ok) {
    throw new Error('Failed to fetch cart data');
  }
  return await response.json();
};
