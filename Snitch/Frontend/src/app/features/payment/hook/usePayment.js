import { useDispatch } from 'react-redux';
import { setClientSecret, setPaymentId, setLoading, setError } from '../state/payment.slice';
import { CreatePaymentIntent, GetPaymentStatus } from '../service/payment.api.js';

export function usePayment() {
    const dispatch = useDispatch();

    async function handleCreatePaymentIntent() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await CreatePaymentIntent();
            dispatch(setClientSecret(response.clientSecret));
            dispatch(setPaymentId(response.paymentId));
            return response;
        } catch (error) {
            const message = error?.message || 'Failed to initiate payment.';
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetPaymentStatus(paymentId) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await GetPaymentStatus(paymentId);
            return response;
        } catch (error) {
            const message = error?.message || 'Failed to fetch payment status.';
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleCreatePaymentIntent, handleGetPaymentStatus };
}
