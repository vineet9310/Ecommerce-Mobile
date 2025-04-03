import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include', // ✅ Ensures JWT cookies are sent
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const cartApiSlice = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart', // ✅ Corrected API route
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: '/cart',
        method: 'POST',
        body: { productId: cartData.product, quantity: cartData.quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: '/cart',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} = cartApiSlice;
