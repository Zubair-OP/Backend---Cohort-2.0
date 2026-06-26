import axios from 'axios';
import { API_BASE_URL } from '../../../config/apiBaseUrl.js';

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
