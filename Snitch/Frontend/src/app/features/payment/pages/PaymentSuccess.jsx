import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const formatCurrency = (amount, currency = 'PKR') =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount) || 0);

const CheckCircle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-14 w-14 text-green-500">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { paymentId, amount } = state || {};

    return (
        <div className="min-h-screen bg-neutral-50 text-text-primary">
            <header className="border-b border-border-light bg-white">
                <div className="mx-auto flex max-w-5xl items-center px-4 py-3.5 md:px-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-sm font-semibold tracking-[0.2em] text-black"
                    >
                        <span className="border border-black px-1.5 py-0.5 text-xs">SN</span>
                        <span className="border border-black px-1.5 py-0.5 text-xs">ITCH</span>
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-md px-4 py-16 text-center md:px-6">
                <CheckCircle />

                <h1 className="mt-5 text-xl font-medium text-text-primary">Payment Successful</h1>
                <p className="mt-2 text-sm text-text-secondary">
                    Thank you for your order. Your payment has been confirmed.
                </p>

                {amount > 0 && (
                    <p className="mt-1 text-base font-semibold text-text-primary">
                        {formatCurrency(amount)}
                    </p>
                )}

                {paymentId && (
                    <p className="mt-3 text-[11px] text-text-muted">
                        Order ref: <span className="font-mono">{paymentId}</span>
                    </p>
                )}

                <div className="mt-8 space-y-2">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full rounded bg-black py-2.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PaymentSuccess;
