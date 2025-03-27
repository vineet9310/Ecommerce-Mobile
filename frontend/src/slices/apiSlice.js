import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 500) {
    console.error('API Error:', result.error);
    result.error.data = { message: 'Internal Server Error. Please try again later.' };
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 30,
});