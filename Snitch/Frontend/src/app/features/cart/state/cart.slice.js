import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalPrice: 0,
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.cart?.items || [];
            state.totalPrice = action.payload?.totalPrice || 0;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
        },
    },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
