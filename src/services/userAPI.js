import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config";

export const userApi = createApi({
    reducerPath: "userManagement",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            headers.append("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (id) => ({
                url: `users/get-all-users/3`,
                method: "GET",
            }),
        }),
        getPartners: builder.query({
            query: (id) => ({
                url: `users/get-all-users/2`,
                method: "GET",
            }),
        }),
        changeStatusUser: builder.mutation({
            query: (body) => ({
                url: `users/block-or-enable/${body.userId}/${body.status}`,
                method: "PUT",
            }),
        }),
        getUserDetails: builder.query({
            query: (id) => ({
                url: `users/get-user/${id}`,
                method: "GET",
            }),
        }),
        updateProfile: builder.mutation({
            query: (body) => ({
                url: `users/update-profile`,
                method: "PUT",
                body: body,
            }),
        }),
        updatePasswords: builder.mutation({
            query: ({ id, body }) => ({
                url: `users/update-password/${id}`,
                method: "PUT",
                body: body,
            }),

        }),
    }),
})

export const {
    useGetUsersQuery,
    useGetPartnersQuery,
    useChangeStatusUserMutation,
    useGetUserDetailsQuery,
    useUpdateProfileMutation,
    useUpdatePasswordsMutation,
} = userApi;
