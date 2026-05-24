import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost:3000/api/cart",
    withCredentials: true,
});

export const addTocart = async (productId, variantId) => {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`;
    const response = await Api.post(url, { quantity: 1 });
    return response.data;
};

export const getCart = async () => {
    const response = await Api.get(`/get`);
    return response.data;
};

export const incrementCartItem = async (productId, variantId) => {
    const url = variantId ? `/increment/${productId}/${variantId}` : `/increment/${productId}`;
    const response = await Api.patch(url);
    return response.data;
};

export const decrementCartItem = async (productId, variantId) => {
    const url = variantId ? `/decrement/${productId}/${variantId}` : `/decrement/${productId}`;
    const response = await Api.patch(url);
    return response.data;
};

