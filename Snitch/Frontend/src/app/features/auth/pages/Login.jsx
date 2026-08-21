import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import { toast } from 'react-toastify';
import SEO from '../../../../app/components/SEO';

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            setErrors({});
            setFormError('');
            const user = await handleLogin({
                email: formData.email,
                password: formData.password,
            });

            toast.success('Signed in successfully.');

            if (user.role === 'seller') {
                navigate('/Dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setErrors(error.fieldErrors || {});
            setFormError(error.message || 'Unable to sign in.');
            toast.error(error.message || 'Unable to sign in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative h-screen overflow-hidden bg-cream text-text-primary">
            <SEO
                title="Sign In to Snitch"
                description="Sign in to your Snitch account to track orders, manage your wishlist, and shop premium everyday clothing."
                url="https://snitch.store/login"
            />

            {/* Mobile background image */}
            <div className="absolute inset-0 lg:hidden">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-cream/80" />
            </div>

            <div className="relative z-10 grid h-full lg:grid-cols-2">
                {/* Desktop left panel */}
                <div className="relative hidden overflow-hidden bg-warm-gray lg:flex">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
                        alt="Snitch sign in"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col justify-between p-7 xl:p-8">
                        <div className="flex items-center gap-1 text-sm font-semibold tracking-[0.16em] text-white">
                            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 backdrop-blur-sm">SN</span>
                            <span className="text-xs tracking-[0.3em]">ITCH</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">Welcome back</p>
                            <h2 className="mt-3 max-w-sm font-serif text-[28px] font-medium leading-[1.15] text-white xl:text-[32px]">
                                A cleaner way to shop, manage, and return to your essentials.
                            </h2>
                            <p className="mt-4 max-w-xs text-[13px] leading-5 text-white/70">
                                Sign in to continue browsing new arrivals, saved products, and your shopping bag.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form panel */}
                <div className="relative z-10 flex items-center justify-center px-6 py-6 lg:col-span-1">
                    <div className="w-full max-w-[430px]">
                        <div className="double-bezel">
                            <div className="double-bezel-inner p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs font-semibold tracking-[0.16em] text-black">
                                        <span className="rounded-full border border-black/10 bg-bg-secondary px-2 py-1">SN</span>
                                        <span className="text-xs tracking-[0.3em]">ITCH</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">Sign in</p>
                                    <h1 className="mt-1 font-serif text-[22px] font-medium leading-[1.15] text-text-primary">
                                        Welcome back to Snitch
                                    </h1>
                                    <p className="mt-1 text-[12px] leading-5 text-text-secondary">
                                        Enter your details to continue shopping or manage your seller account.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="login-email" className="text-[13px] font-medium text-text-primary">
                                            Email Address
                                        </label>
                                        <input
                                            id="login-email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="hello@example.com"
                                            className="h-10 w-full rounded-full border border-border-light bg-cream px-5 text-[13px] text-text-primary outline-none transition-all duration-600 ease-premium placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/10"
                                            disabled={isSubmitting}
                                        />
                                        {errors.email ? (
                                            <p className="text-xs leading-5 text-red-500">
                                                {errors.email}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="login-password" className="text-[13px] font-medium text-text-primary">
                                                Password
                                            </label>
                                            <span className="text-xs text-text-muted">
                                                Password reset coming soon
                                            </span>
                                        </div>
                                        <input
                                            id="login-password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="h-10 w-full rounded-full border border-border-light bg-cream px-5 text-[13px] text-text-primary outline-none transition-all duration-600 ease-premium placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/10"
                                            disabled={isSubmitting}
                                        />
                                        {errors.password ? (
                                            <p className="text-xs leading-5 text-red-500">
                                                {errors.password}
                                            </p>
                                        ) : null}
                                    </div>

                                    {formError ? (
                                        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm leading-5 text-red-500">
                                            {formError}
                                        </p>
                                    ) : null}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-magnetic w-full rounded-full bg-bg-dark px-8 py-2.5 text-[13px] font-medium uppercase tracking-wider text-white transition-all duration-600 ease-premium hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-border-light" />
                                        <span className="text-xs text-text-muted">or</span>
                                        <div className="h-px flex-1 bg-border-light" />
                                    </div>

                                    <ContinueWithGoogle />

                                    <p className="text-center text-[13px] text-text-secondary">
                                        Don&apos;t have an account yet?{' '}
                                        <a
                                            href="/register"
                                            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
                                            className="cursor-pointer font-medium text-text-primary underline underline-offset-4 transition-all duration-600 ease-premium hover:text-accent"
                                        >
                                            Register
                                        </a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
