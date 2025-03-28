import { apiSlice } from './apiSlice';
import { setCredentials, logout } from '../slices/authSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Register User
    register: builder.mutation({
      query: (data) => ({
        url: '/api/users/register',
        method: 'POST',
        body: data,
      }),
    }),

    // 🔹 Login User
    login: builder.mutation({
      query: (data) => ({
        url: '/api/users/login',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
          localStorage.setItem('userInfo', JSON.stringify(data.user));
          localStorage.setItem('token', JSON.stringify(data.token));
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),

    // 🔹 Logout User
    logout: builder.mutation({
      query: () => ({
        url: '/api/users/logout',
        method: 'POST',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),

    // 🔹 Get User Profile
    getProfile: builder.query({
      query: () => ({
        url: '/api/users/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data, token: localStorage.getItem('token') }));
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      },
    }),

    // 🔹 Update Profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // 🔹 🔥 (NEW) Get All Users (Admin Only)
    getUsers: builder.query({
      query: () => ({
        url: '/api/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    // 🔹 🔥 (NEW) Get Single User by ID (Admin Only)
    getUserById: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // 🔹 🔥 (NEW) Update Any User (Admin Only)
    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: ['Users'],
    }),

    // 🔹 🔥 (NEW) Delete User (Admin Only)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
