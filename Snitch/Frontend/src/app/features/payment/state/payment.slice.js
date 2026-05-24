import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        clientSecret: null,
        paymentId: null,
        loading: false,
        error: null,
    },
    reducers: {
        setClientSecret: (state, action) => {
            state.clientSecret = action.payload;
        },
        setPaymentId: (state, action) => {
            state.paymentId = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetPayment: (state) => {
            state.clientSecret = null;
            state.paymentId = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { setClientSecret, setPaymentId, setLoading, setError, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
