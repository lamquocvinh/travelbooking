import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        guests: 1,
        rooms: 1,
        date: [],
        destination: 'TP Hồ Chí Minh',
        hotelId: 0,
        hotelName: "",
        roomTypeId: 0,
        roomTypeName: "",
        roomPrice: 0,
        roomImage: ""
    },
    reducers: {
        setGuests: (state, action) => {
            state.guests = action.payload;
        },
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setHotelInfo: (state, action) => {
            state.hotelId = action.payload.hotelId;
            state.hotelName = action.payload.hotelName;
        },
        setRoomInfo: (state, action) => {
            state.roomTypeId = action.payload.roomTypeId;
            state.roomTypeName = action.payload.roomTypeName;
            state.roomPrice = action.payload.roomPrice;
            state.roomImage = action.payload.roomImage;
        },
    }
});

export const {
    setGuests,
    setRooms,
    setDate,
    setDestination,
    setHotelInfo,
    setRoomInfo
} = bookingSlice.actions;
export default bookingSlice.reducer;
