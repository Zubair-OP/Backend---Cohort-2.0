import {configureStore} from '@reduxjs/toolkit';
import AiReducer from "./app/features/Ai/state/Ai.slice";

const store = configureStore({
  reducer: {
    ai: AiReducer,
  },
});

export default store;