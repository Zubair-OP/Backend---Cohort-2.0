import {configureStore} from '@reduxjs/toolkit';
import authReducer from './app/features/auth/state/auth.slice';
import productReducer from './app/features/product/state/product.slice';
import cartReducer from './app/features/cart/state/cart.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
  },
});
export default store;
