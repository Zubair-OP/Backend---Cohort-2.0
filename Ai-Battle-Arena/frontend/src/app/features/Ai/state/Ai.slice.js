import {createSlice} from '@reduxjs/toolkit'

const AiReducer = createSlice({
    name: "ai",
    initialState: {
        result: null,
        loading: false,
        error: null,
    },
    reducers: {
        setResult: (state, action) => {
            state.result = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const {setResult, setLoading, setError} = AiReducer.actions;
export default AiReducer.reducer;