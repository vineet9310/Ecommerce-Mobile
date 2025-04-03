import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include', // ✅ Ensures JWT cookies are sent
  prepareHeaders: (headers, { getState }) => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const token = getState().auth.userInfo?.token || userInfo?.token;

    console.log('Token Retrieved:', token); // Debugging

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn("⚠️ No Token Found in Redux or LocalStorage!");
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
      query: (id) => ({
        url: `/cart/remove/${id}`, // ✅ Corrected endpoint
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCart: builder.mutation({
      query: ({ id, qty }) => ({
        url: `/cart/${id}`,
        method: 'PUT',
        body: { qty },
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
