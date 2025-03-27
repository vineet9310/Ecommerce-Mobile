import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

// Base URL from environment variable
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Enhanced API Request Handler
const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized (Token Expired)
  if (result.error && result.error.status === 401) {
    console.warn('Unauthorized! Logging out...');
    api.dispatch(logout());
  }

  // Handle 500 Internal Server Errors
  if (result.error && result.error.status === 500) {
    console.error('API Error:', result.error);
    result.error.data = { message: 'Internal Server Error. Please try again later.' };
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 30,
});
