import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config";

export const authApi = createApi({
  reducerPath: "authManagement",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({
        url: `users/login`,
        method: "POST",
        body: body,
      }),
    }),
    registerUser: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `users/register`,
          body: body,
        }
      },
    }),
    getOtp: builder.mutation({
      query: (email) => {
        return {
          method: "POST",
          url: `forgot-password/send-otp/${email}`,
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: `forgot-password/verify-otp/${data.email}`,
          body: data.body,
        };
      },
    }),
    changePasswordByEmail: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: `forgot-password/change-password/${data.email}`,
          body: data.body,
        };
      },
    }),
    // refreshToken: builder.mutation({
    //   query: ({ refreshToken }) => ({
    //     url: `users/refresh-token`,
    //     method: "POST",
    //     body: { refreshToken: refreshToken }, // pass the refresh token in the body
    //   }),
    // }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordByEmailMutation
} = authApi;
