import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api/payments',
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
