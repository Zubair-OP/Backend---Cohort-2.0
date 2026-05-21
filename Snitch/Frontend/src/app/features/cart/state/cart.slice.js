import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        currency: 'PKR',
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || [];
            state.currency = action.payload?.items?.[0]?.price?.currency || 'PKR';
        },
        clearCart: (state) => {
            state.items = [];
            state.currency = 'PKR';
        },
    },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
