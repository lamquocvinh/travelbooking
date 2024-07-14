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
        },
    },
});

export const { setInfo, setInfoBooking, logOut, setPackageId } = authSlice.actions;
export default authSlice.reducer;
