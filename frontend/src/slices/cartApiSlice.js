import { apiSlice } from './apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch Cart Items
    getCart: builder.query({
      query: () => '/api/cart',
      providesTags: ['Cart'],
    }),

    // ✅ Add to Cart
    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: '/api/cart',
        method: 'POST',
        body: cartItem,
      }),
      invalidatesTags: ['Cart'],
    }),

    // ✅ Update Cart Item (Quantity)
    updateCart: builder.mutation({
      query: ({ productId, qty }) => ({
        url: `/api/cart/${productId}`,
        method: 'PUT',
        body: { qty },
      }),
      invalidatesTags: ['Cart'],
    }),

    // ✅ Remove Item from Cart
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

// 🔹 Export Hooks
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation, // ✅ Now this is exported correctly!
  useRemoveFromCartMutation,
} = cartApiSlice;
