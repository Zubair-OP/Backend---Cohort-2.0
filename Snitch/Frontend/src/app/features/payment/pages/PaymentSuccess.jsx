import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const formatCurrency = (amount, currency = 'PKR') =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount) || 0);

const CheckCircle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-16 w-16 text-accent">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { paymentId, amount } = state || {};

    return (
        <div className="min-h-screen bg-cream text-text-primary">
            <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
                <div className="mx-auto max-w-5xl">
                    <nav className="glass rounded-full px-5 py-3 md:px-8 md:py-3.5">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-1 text-sm font-bold tracking-[0.25em] text-black"
                            >
                                <span className="rounded-full border border-black/10 bg-white/50 px-2 py-0.5 text-xs">SN</span>
                                <span className="text-xs tracking-[0.3em]">ITCH</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-md px-4 py-16 text-center md:px-6">
                <CheckCircle />

                <h1 className="mt-6 font-serif text-xl font-medium text-text-primary">Payment Successful</h1>
                <p className="mt-2.5 text-sm text-text-secondary">
                    Thank you for your order. Your payment has been confirmed.
                </p>

                {amount > 0 && (
                    <p className="mt-2 text-base font-semibold text-accent">
                        {formatCurrency(amount)}
                    </p>
                )}

                {paymentId && (
                    <p className="mt-4 text-[11px] text-text-muted">
                        Order ref: <span className="font-mono">{paymentId}</span>
                    </p>
                )}

                <div className="mt-8 space-y-2.5">
                    <button
                        onClick={() => navigate('/')}
                        className="btn-magnetic w-full rounded-full bg-bg-dark py-3 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PaymentSuccess;
