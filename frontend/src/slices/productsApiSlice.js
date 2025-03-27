import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/api/products',
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (id) => `/api/products/${id}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApiSlice;