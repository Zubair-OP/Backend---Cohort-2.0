import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCart } from '../hook/useCart';

const formatCurrency = (amount, currency = 'PKR') =>
    new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const buildCartKey = (productId, variantId) => `${productId}-${variantId ?? 'no-variant'}`;

const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-12 w-12 text-neutral-300">
        <circle cx="9" cy="20" r="1.25" />
        <circle cx="17" cy="20" r="1.25" />
        <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
    </svg>
);

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const Cart = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { items, totalPrice, handleGetCart, handleIncrementItem, handleDecrementItem } = useCart();
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadCart = async () => {
            try {
                await handleGetCart();
            } catch {
                toast.error('Failed to load cart.');
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    const handleIncrement = async (productId, variantId) => {
        const key = buildCartKey(productId, variantId);
        try {
            setUpdatingItem(key);
            await handleIncrementItem(productId, variantId);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Stock limit reached.');
        } finally {
            setUpdatingItem(null);
        }
    };

    const handleDecrement = async (productId, variantId, quantity) => {
        const key = buildCartKey(productId, variantId);
        try {
            setUpdatingItem(key);
            await handleDecrementItem(productId, variantId);
            toast.success(quantity === 1 ? 'Item removed from bag.' : 'Bag updated.');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update quantity.');
        } finally {
            setUpdatingItem(null);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-text-primary">
            <header className="border-b border-border-light bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 md:px-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-sm font-semibold tracking-[0.2em] text-black"
                    >
                        <span className="border border-black px-1.5 py-0.5 text-xs">SN</span>
                        <span className="border border-black px-1.5 py-0.5 text-xs">ITCH</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-black"
                    >
                        <ChevronLeft />
                        Continue shopping
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
                <div className="mb-6 flex items-baseline gap-2">
                    <h1 className="text-lg font-medium text-text-primary">Shopping Bag</h1>
                    {!loading && items.length > 0 ? (
                        <span className="text-xs text-text-muted">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    ) : null}
                </div>

                {loading ? (
                    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-3 rounded-lg border border-border-light bg-white p-4">
                                    <div className="h-24 w-20 shrink-0 animate-pulse rounded bg-neutral-100" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
                                        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
                                        <div className="h-3 w-1/4 animate-pulse rounded bg-neutral-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="h-56 animate-pulse rounded-lg border border-border-light bg-neutral-100" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-lg border border-border-light bg-white py-20 text-center">
                        <CartIcon />
                        <h2 className="mt-4 text-base font-medium text-text-primary">Your bag is empty</h2>
                        <p className="mt-1.5 text-xs text-text-muted">
                            Browse the collection and add pieces to your bag.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-5 rounded bg-black px-6 py-2 text-xs text-white transition-colors hover:bg-neutral-800"
                        >
                            Shop now
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                        <div className="space-y-2.5">
                            {items.map((item) => {
                                const productId = item.product?._id || item.product;
                                const variantId = item.variant?._id || item.variant || null;
                                const key = buildCartKey(productId, variantId);
                                const isUpdating = updatingItem === key;
                                const image = item.product?.images?.[0]?.url;
                                const title = item.product?.title;
                                const subtotal = (item.price?.amount || 0) * item.quantity;
                                const variantAttributes = item.variant?.attributes
                                    ? Object.entries(item.variant.attributes)
                                    : [];

                                return (
                                    <div
                                        key={key}
                                        className="flex gap-3 rounded-lg border border-border-light bg-white p-3 sm:p-4"
                                    >
                                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded border border-neutral-100 bg-white sm:h-28 sm:w-24">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={title || 'Product'}
                                                    className="h-full w-full object-contain"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-neutral-50 text-xs text-text-muted">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="line-clamp-2 text-sm font-medium leading-5 text-text-primary">
                                                        {title || 'Product'}
                                                    </h3>
                                                    {variantAttributes.length > 0 ? (
                                                        <p className="mt-1 text-xs text-text-secondary">
                                                            {variantAttributes.map(([name, value]) => `${name}: ${value}`).join(' | ')}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <p className="shrink-0 text-sm font-semibold text-text-primary">
                                                    {formatCurrency(subtotal, item.price?.currency)}
                                                </p>
                                            </div>

                                            <p className="mt-1 text-xs text-text-muted">
                                                {formatCurrency(item.price?.amount, item.price?.currency)} / piece
                                            </p>

                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center rounded border border-neutral-200">
                                                    <button
                                                        onClick={() => handleDecrement(productId, variantId, item.quantity)}
                                                        disabled={isUpdating}
                                                        className="flex h-7 w-7 items-center justify-center text-sm text-text-primary transition-colors hover:bg-neutral-50 disabled:opacity-40"
                                                        aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-medium text-text-primary">
                                                        {isUpdating ? '...' : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleIncrement(productId, variantId)}
                                                        disabled={isUpdating}
                                                        className="flex h-7 w-7 items-center justify-center text-sm text-text-primary transition-colors hover:bg-neutral-50 disabled:opacity-40"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(productId, variantId, item.quantity)}
                                                    className="text-xs text-text-muted transition-colors hover:text-red-500"
                                                >
                                                    {item.quantity === 1 ? 'Remove item' : 'Remove one'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="h-fit lg:sticky lg:top-6">
                            <div className="rounded-lg border border-border-light bg-white p-4">
                                <h2 className="text-sm font-medium text-text-primary">Order Summary</h2>

                                <div className="mt-3 space-y-2 border-t border-border-light pt-3">
                                    {items.map((item) => {
                                        const productId = item.product?._id || item.product;
                                        const variantId = item.variant?._id || item.variant;
                                        return (
                                            <div
                                                key={`sum-${buildCartKey(productId, variantId)}`}
                                                className="flex items-start justify-between gap-2"
                                            >
                                                <span className="line-clamp-1 max-w-[65%] text-xs text-text-secondary">
                                                    {item.product?.title || 'Product'}
                                                    <span className="ml-1 text-text-muted">x{item.quantity}</span>
                                                </span>
                                                <span className="shrink-0 text-xs font-medium text-text-primary">
                                                    {formatCurrency(
                                                        (item.price?.amount || 0) * item.quantity,
                                                        item.price?.currency,
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-3 space-y-2 border-t border-border-light pt-3">
                                    <div className="flex items-center justify-between text-xs text-text-secondary">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-text-primary">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-text-secondary">
                                        <span>Shipping</span>
                                        <span>At checkout</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-text-secondary">
                                        <span>Tax</span>
                                        <span>Included</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-border-light pt-3">
                                    <p className="text-sm font-medium text-text-primary">Total</p>
                                    <p className="text-base font-semibold text-text-primary">
                                        {formatCurrency(totalPrice)}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={() => {
                                            if (checkingOut) return;
                                            setCheckingOut(true);
                                            navigate('/checkout');
                                        }}
                                        disabled={checkingOut}
                                        className="flex w-full items-center justify-center gap-2 rounded bg-black py-2.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:opacity-70"
                                    >
                                        {checkingOut ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Proceeding...
                                            </>
                                        ) : (
                                            'Proceed to Checkout'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full rounded border border-neutral-200 py-2.5 text-xs text-text-secondary transition-colors hover:border-black hover:text-black"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
