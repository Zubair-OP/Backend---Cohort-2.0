import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const API = axios.create({
    baseURL: `${API_BASE_URL}/api/payments`,
    withCredentials: true,
});

export async function CreatePaymentIntent() {
    try {
        const response = await API.post('/create-intent');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function GetPaymentStatus(paymentId) {
    try {
        const response = await API.get(`/${paymentId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
