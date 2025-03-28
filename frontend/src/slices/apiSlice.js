import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../slices/authSlice';

// 🔹 Base API Query
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');  // ✅ Check Redux state first
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 🔹 Base Query with Token Refresh & Error Handling
const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn('Unauthorized! Trying to refresh token...');

    const refreshResult = await baseQuery('/api/auth/refresh-token', api, extraOptions);

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      localStorage.setItem('token', refreshResult.data.token);

      // 🔄 Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn('Token refresh failed! Logging out...');
      api.dispatch(logout());
      localStorage.removeItem('token');
    }
  }

  if (result.error && result.error.status === 500) {
    console.error('API Error:', result.error);
    result.error.data = {
      message: 'Internal Server Error. Please try again later.',
      details: result.error.data,
    };
  }

  return result;
};

// 🔹 API Slice
export const apiSlice = createApi({
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ['Product', 'Order', 'User', 'Cart'],  // ✅ Added 'Cart' for caching cart data
  endpoints: (builder) => ({
    // ✅ User Registration
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/api/users/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
          localStorage.setItem('token', data.token);
        } catch (error) {
          console.error('Register error:', error);
        }
      },
    }),

    // ✅ User Login
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/api/users/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
          localStorage.setItem('token', data.token);
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),

    // ✅ Token Refresh
    refreshToken: builder.query({
      query: () => '/api/auth/refresh-token',
    }),
  }),
  keepUnusedDataFor: 30,
});

// 🔹 Export Hooks
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRefreshTokenQuery,
} = apiSlice;
