import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from 'redux-persist';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        userId: null,
        fullName: null,
        email: null,
        phoneNumber: null,
        role: null,
        packageId: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            sessionStorage.setItem("token", action.payload);
        },
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

        logOut: (state, action) => {
            state.fullName = null;
            state.userId = null;
            state.email = null;
            state.phoneNumber = null;
            state.role = null;
            state.token = null;
            state.packageId = null;
            sessionStorage.clear();
            localStorage.clear();
        },

    },
    selectors: {
        selectTokens: (auth) => auth.token,
    },
    // extraReducers: (builder) => {
    //     builder.addCase(PURGE, () => initialState);
    // },
});

export const { setToken, setInfo, setInfoBooking, logOut, setPackageId } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state) => state.auth.token;
export const { selectTokens } = authSlice.selectors;
