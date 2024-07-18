import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userId: null,
        fullName: null,
        email: null,
        phoneNumber: null,
        role: null,
        packageId: null,
        package_start_date: null,
        package_end_date: null,
    },
    reducers: {
        setInfo: (state, action) => {
            state.userId = action.payload.userId;
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.role = action.payload.role;
        },
        setInfoBooking: (state, action) => {
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
        },
        setPackageId: (state, action) => {
            state.packageId = action.payload;
        },
        setPackageStart: (state, action) => {
            state.package_start_date = action.payload;
        },
        setPackageEnd: (state, action) => {
            state.package_end_date = action.payload;
        },
        logOut: (state) => {
            sessionStorage.clear();
            localStorage.clear();
            localStorage.removeItem('packageId');
            localStorage.removeItem('token');
            state.userId = null;
            state.fullName = null;
            state.email = null;
            state.phoneNumber = null;
            state.role = null;
            state.packageId = null;
            state.package_start_date = null;
            state.package_end_date = null;
        },
    },
});

export const { setInfo, setInfoBooking, logOut, setPackageId, setPackageStart, setPackageEnd } = authSlice.actions;
export default authSlice.reducer;
