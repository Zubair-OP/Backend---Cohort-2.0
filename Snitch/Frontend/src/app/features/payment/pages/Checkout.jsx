import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { clearCart } from '../../cart/state/cart.slice';
import { clearCart as clearCartApi } from '../../cart/service/cart.api';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { usePayment } from '../hook/usePayment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const formatCurrency = (amount, currency = 'PKR') =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount) || 0);

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const CheckoutForm = ({ paymentId, cartTotal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.auth.user?.email);
    const [paying, setPaying] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const submittingRef = React.useRef(false);
    const paymentElementOptions = {
        layout: 'tabs',
        defaultValues: userEmail
            ? {
                  billingDetails: {
                      email: userEmail,
                  },
              }
            : undefined,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || submittingRef.current) return;

        submittingRef.current = true;
        setPaying(true);
        setErrorMessage(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            submittingRef.current = false;
            setPaying(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message);
            submittingRef.current = false;
            setPaying(false);
        } else if (paymentIntent?.status === 'succeeded') {
            try {
                await clearCartApi();
            } catch (clearError) {
                console.warn('[checkout] Failed to clear cart after payment:', clearError);
            } finally {
                dispatch(clearCart());
                navigate('/payment-success', { state: { paymentId, amount: cartTotal } });
            }
        } else {
            setErrorMessage('Payment could not be completed. Please try again.');
            submittingRef.current = false;
            setPaying(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <PaymentElement options={paymentElementOptions} />

            {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-500">
                    {errorMessage}
                </div>
            ) : null}

            <button
                type="submit"
                disabled={!stripe || paying}
                className="btn-magnetic flex w-full items-center justify-center gap-2 rounded-full bg-bg-dark py-3.5 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {paying ? (
                    <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                    </>
                ) : (
                    <>
                        <LockIcon />
                        Pay {cartTotal ? formatCurrency(cartTotal) : 'Now'}
                    </>
                )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
                <LockIcon />
                Secured by Stripe
            </p>
        </form>
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const { handleCreatePaymentIntent } = usePayment();
    const hasCreatedIntent = useRef(false);

    const clientSecret = useSelector((state) => state.payment.clientSecret);
    const paymentId = useSelector((state) => state.payment.paymentId);
    const loading = useSelector((state) => state.payment.loading);
    const error = useSelector((state) => state.payment.error);
    const cartTotal = useSelector((state) => state.cart.totalPrice);

    useEffect(() => {
        if (hasCreatedIntent.current) return;
        hasCreatedIntent.current = true;

        handleCreatePaymentIntent().catch((err) => {
            hasCreatedIntent.current = false;
            toast.error(err?.message || 'Failed to initiate payment.');
        });
    }, []);

    return (
        <div className="min-h-screen bg-cream text-text-primary">
            <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
                <div className="mx-auto max-w-5xl">
                    <nav className="glass rounded-full px-5 py-3 md:px-8 md:py-3.5">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-1 text-sm font-bold tracking-[0.25em] text-black"
                            >
                                <span className="rounded-full border border-black/10 bg-white/50 px-2 py-0.5 text-xs">SN</span>
                                <span className="text-xs tracking-[0.3em]">ITCH</span>
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex items-center gap-1 text-xs text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                            >
                                <ChevronLeft />
                                Back to cart
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-md px-4 py-10 md:px-6">
                <h1 className="mb-2 font-serif text-lg font-medium text-text-primary">Checkout</h1>
                <p className="mb-6 text-sm text-text-secondary">
                    Review your payment details and complete your order securely.
                </p>

                {loading ? (
                    <div className="space-y-3">
                        <div className="h-10 animate-pulse rounded-full bg-warm-gray" />
                        <div className="h-10 animate-pulse rounded-full bg-warm-gray" />
                        <div className="h-10 animate-pulse rounded-full bg-warm-gray/50" />
                    </div>
                ) : null}

                {error && !loading ? (
                    <div className="rounded-4xl border border-border-light bg-white p-6 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                        <button
                            onClick={() => navigate('/cart')}
                            className="btn-magnetic mt-4 rounded-full bg-bg-dark px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-black"
                        >
                            Return to cart
                        </button>
                    </div>
                ) : null}

                {clientSecret && !loading ? (
                    <div className="double-bezel">
                        <div className="double-bezel-inner p-5">
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'stripe',
                                        variables: {
                                            colorPrimary: '#1A1A1A',
                                            borderRadius: '9999px',
                                            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                                        },
                                    },
                                }}
                            >
                                <CheckoutForm paymentId={paymentId} cartTotal={cartTotal} />
                            </Elements>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default Checkout;
