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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-12 w-12 text-text-muted/40">
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
                                onClick={() => navigate('/')}
                                className="flex items-center gap-1 text-xs text-text-secondary transition-colors duration-600 ease-premium hover:text-black"
                            >
                                <ChevronLeft />
                                Continue shopping
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
                <div className="mb-8 flex items-baseline gap-3">
                    <h1 className="font-serif text-lg font-medium text-text-primary">Shopping Bag</h1>
                    {!loading && items.length > 0 ? (
                        <span className="text-xs text-text-muted">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    ) : null}
                </div>

                {loading ? (
                    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="double-bezel">
                                    <div className="double-bezel-inner flex gap-4 p-4">
                                        <div className="h-24 w-20 shrink-0 animate-pulse rounded-2xl bg-warm-gray" />
                                        <div className="flex-1 space-y-2.5 py-1">
                                            <div className="h-3 w-3/4 animate-pulse rounded-full bg-warm-gray" />
                                            <div className="h-3 w-1/2 animate-pulse rounded-full bg-warm-gray" />
                                            <div className="h-3 w-1/4 animate-pulse rounded-full bg-warm-gray" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="h-56 animate-pulse rounded-4xl border border-border-light bg-warm-gray" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-4xl border border-border-light bg-white py-20 text-center">
                        <CartIcon />
                        <h2 className="mt-4 font-serif text-base font-medium text-text-primary">Your bag is empty</h2>
                        <p className="mt-1.5 text-xs text-text-muted">
                            Browse the collection and add pieces to your bag.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-magnetic mt-5 rounded-full bg-bg-dark px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98]"
                        >
                            Shop now
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                        <div className="space-y-3">
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
                                    <div key={key} className="double-bezel">
                                        <div className="double-bezel-inner flex gap-4 p-3 sm:p-4">
                                            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream sm:h-28 sm:w-24">
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={title || 'Product'}
                                                        className="h-full w-full object-contain"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-warm-gray text-xs text-text-muted">
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
                                                    <div className="flex items-center rounded-full border border-border-light">
                                                        <button
                                                            onClick={() => handleDecrement(productId, variantId, item.quantity)}
                                                            disabled={isUpdating}
                                                            className="flex h-7 w-7 items-center justify-center text-sm text-text-primary transition-colors duration-600 ease-premium hover:bg-warm-gray disabled:opacity-40"
                                                            aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-7 text-center text-xs font-medium text-text-primary">
                                                            {isUpdating ? '...' : item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrement(productId, variantId)}
                                                            disabled={isUpdating}
                                                            className="flex h-7 w-7 items-center justify-center text-sm text-text-primary transition-colors duration-600 ease-premium hover:bg-warm-gray disabled:opacity-40"
                                                            aria-label="Increase quantity"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrement(productId, variantId, item.quantity)}
                                                        className="text-xs text-text-muted transition-colors duration-600 ease-premium hover:text-red-500"
                                                    >
                                                        {item.quantity === 1 ? 'Remove item' : 'Remove one'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="h-fit lg:sticky lg:top-6">
                            <div className="double-bezel">
                                <div className="double-bezel-inner p-5">
                                    <h2 className="text-sm font-medium text-text-primary">Order Summary</h2>

                                    <div className="mt-4 space-y-2.5 border-t border-border-light pt-4">
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

                                    <div className="mt-4 space-y-2.5 border-t border-border-light pt-4">
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

                                    <div className="mt-4 flex items-center justify-between border-t border-border-light pt-4">
                                        <p className="text-sm font-medium text-text-primary">Total</p>
                                        <p className="text-base font-semibold text-text-primary">
                                            {formatCurrency(totalPrice)}
                                        </p>
                                    </div>

                                    <div className="mt-5 space-y-2.5">
                                        <button
                                            onClick={() => {
                                                if (checkingOut) return;
                                                setCheckingOut(true);
                                                navigate('/checkout');
                                            }}
                                            disabled={checkingOut}
                                            className="btn-magnetic flex w-full items-center justify-center gap-2 rounded-full bg-bg-dark py-3 text-xs font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-text-muted disabled:opacity-70"
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
                                            className="w-full rounded-full border border-border-light py-3 text-xs font-medium text-text-secondary transition-all duration-600 ease-premium hover:border-bg-dark hover:text-black"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
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
