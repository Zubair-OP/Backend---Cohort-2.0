import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import { toast } from 'react-toastify';

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

    const inputStyle = {
        color: '#1b1c1a',
        borderBottom: '1px solid #d0c5b5',
        fontFamily: "'Inter', sans-serif",
    };

    const handleFocus = (e) => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur = (e) => { e.target.style.borderBottomColor = '#d0c5b5'; };

    return (
        <div className="h-screen overflow-hidden bg-bg-primary text-text-primary">
            <div className="grid h-full lg:grid-cols-2">
                <div className="relative hidden overflow-hidden border-r border-border-light bg-bg-secondary lg:flex">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
                        alt="Snitch sign in"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col justify-between p-7 xl:p-8">
                        <div className="flex items-center gap-1 text-sm font-semibold tracking-[0.16em] text-white">
                            <span className="border border-white px-2 py-1">SN</span>
                            <span className="border border-white px-2 py-1">ITCH</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-white/80">Welcome back</p>
                            <h2 className="mt-2 max-w-sm text-[28px] font-medium leading-[1.15] text-white xl:text-[32px]">
                                A cleaner way to shop, manage, and return to your essentials.
                            </h2>
                            <p className="mt-3 max-w-xs text-[13px] leading-5 text-white/75">
                                Sign in to continue browsing new arrivals, saved products, and your shopping bag.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-4 sm:px-6 md:px-8">
                    <div className="w-full max-w-[430px] rounded border border-border-light bg-white p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs font-semibold tracking-[0.16em] text-black">
                                <span className="border border-black px-2 py-1">SN</span>
                                <span className="border border-black px-2 py-1">ITCH</span>
                            </div>
                        </div>

                        <div className="mb-5">
                            <p className="text-xs uppercase tracking-[0.12em] text-text-muted">Sign in</p>
                            <h1 className="mt-2 text-[24px] font-medium leading-[1.15] text-text-primary">
                                Welcome back to Snitch
                            </h1>
                            <p className="mt-2 text-[13px] leading-5 text-text-secondary">
                                Enter your details to continue shopping or manage your seller account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
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
                                    className="h-9 w-full rounded border border-border-default bg-white px-4 text-[13px] text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                {errors.email ? (
                                    <p className="mt-1 text-xs leading-5 text-red-600">
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
                                    placeholder="........"
                                    className="h-9 w-full rounded border border-border-default bg-white px-4 text-[13px] text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                {errors.password ? (
                                    <p className="mt-1 text-xs leading-5 text-red-600">
                                        {errors.password}
                                    </p>
                                ) : null}
                            </div>

                            {formError ? (
                                <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                                    {formError}
                                </p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-1 w-full rounded bg-black px-8 py-2.5 text-[13px] font-normal text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                                    className="cursor-pointer text-text-primary underline underline-offset-4 transition-all duration-300 hover:text-black"
                                >
                                    Register
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
