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

export const dashboardApi = createApi({
    reducerPath: "dashboardManagement",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getTotalRevenue: builder.query({
            query: () => ({
                url: `dashboards/total-revenue`,
                method: "GET",
            }),
        }),
        getTotalRevenueByPackage: builder.query({
            query: () => ({
                url: `dashboards/total-revenue-by-package`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetTotalRevenueQuery,
    useGetTotalRevenueByPackageQuery,
} = dashboardApi;
