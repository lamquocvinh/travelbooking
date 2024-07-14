import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config";

const currentUnixTimestamp = Math.floor(Date.now() / 1000);

// Base query with Authorization header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Base query without Authorization header
const baseQueryWithoutAuth = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        return headers;
    },
});

export const packageApi = createApi({
    reducerPath: "packageManagement",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getAllPackages: builder.query({
            query: () => ({
                url: `packages/get-all-package`,
                method: "GET",
            }),
        }),
        getPackageDetails: builder.query({
            query: (packageId) => ({
                url: `packages/${packageId}`,
                method: "GET",
            }),
        }),
        createPackage: builder.mutation({
            query: (body) => ({
                url: `packages/create-package`,
                method: "POST",
                body: body,
            }),
        }),
        editPackage: builder.mutation({
            query: (body) => ({
                url: `packages/${body.packageId}`,
                method: "PUT",
                body: body.data,
            }),
        }),
        registerPackage: builder.mutation({
            query: (packageId) => ({
                url: `packages/register-package/${packageId}`,
                method: "POST",
            }),
        }),
        updateStatusPackage: builder.mutation({
            query: (data) => ({
                url: `packages/update-status/${data.userId}?newStatus=${data.status}`,
                method: "PUT",
            }),
        }),
        checkExpiration: builder.query({
            query: () => ({
                url: `packages/check-package-expiration`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetAllPackagesQuery,
    useGetPackageDetailsQuery,
    useCreatePackageMutation,
    useEditPackageMutation,
    useRegisterPackageMutation,
    useUpdateStatusPackageMutation,
    useCheckExpirationQuery,
} = packageApi;
