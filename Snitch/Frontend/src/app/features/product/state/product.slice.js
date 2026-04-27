import { createSlice } from "@reduxjs/toolkit";


const productReducer = createSlice({
    name: "product",
    initialState: {
        products: [],
        loading: true,
        error: null
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setProducts, setLoading, setError } = productReducer.actions
export default productReducer.reducer