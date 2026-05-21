import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../state/cart.slice";
import {
    addTocart,
    getCart as apiGetCart,
    incrementCartItem as apiIncrement,
    decrementCartItem as apiDecrement,
} from "../service/cart.api";

export const useCart = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.cart.items);
    const currency = useSelector((state) => state.cart.currency);

    async function handleGetCart() {
        const response = await apiGetCart();
        if (response.success) {
            dispatch(setCart(response.cart));
        }
        return response;
    }

    async function handleAddItem(productId, variantId) {
        await addTocart(productId, variantId);
        await handleGetCart();
    }

    async function handleIncrementItem(productId, variantId) {
        const response = await apiIncrement(productId, variantId);
        if (response.success) {
            await handleGetCart();
        }
        return response;
    }

    async function handleDecrementItem(productId, variantId) {
        const response = await apiDecrement(productId, variantId);
        if (response.success) {
            await handleGetCart();
        }
        return response;
    }

    return { items, currency, handleAddItem, handleIncrementItem, handleDecrementItem, handleGetCart };
};
