import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import { toast } from 'react-toastify';

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
            const response = await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                isSeller: formData.isSeller,
                fullname: formData.fullName,
            });

            toast.success(response?.message || 'Account created successfully.');

            if (formData.isSeller === true) {
                navigate('/Dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setErrors(error.fieldErrors || {});
            setFormError(error.message || 'Unable to create account.');
            toast.error(error.message || 'Unable to create account.');
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
            <div className="flex h-full">
                <div className="relative hidden w-[44%] shrink-0 overflow-hidden border-r border-border-light bg-bg-secondary lg:flex">
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
                        alt="Snitch register"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col justify-between p-6 xl:p-7">
                        <div className="flex items-center gap-1 text-sm font-semibold tracking-[0.16em] text-white">
                            <span className="border border-white px-2 py-1">SN</span>
                            <span className="border border-white px-2 py-1">ITCH</span>
                        </div>
                        <div className="max-w-[230px]">
                            <p className="text-[11px] uppercase tracking-[0.12em] text-white/80">Create account</p>
                            <h2 className="mt-2 text-[21px] font-medium leading-[1.2] text-white">
                                Join Snitch
                            </h2>
                            <p className="mt-2 text-[12px] leading-5 text-white/75">
                                Clean storefront access for customers and sellers.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center px-4 py-4 sm:px-6 md:px-8">
                    <div className="w-full max-w-[470px] rounded border border-border-light bg-white p-3">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs font-semibold tracking-[0.16em] text-black">
                                <span className="border border-black px-2 py-1">SN</span>
                                <span className="border border-black px-2 py-1">ITCH</span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
                            <div className="mb-1">
                                <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Create account</p>
                                <h1 className="mt-1 text-[22px] font-medium leading-[1.1] text-text-primary">
                                    Start your Snitch account
                                </h1>
                                <p className="mt-1 text-[12px] leading-5 text-text-secondary">
                                    Customer and seller access in one clean signup flow.
                                </p>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="reg-fullName" className="text-[13px] font-medium text-text-primary">
                                        Full Name
                                    </label>
                                    <input
                                        id="reg-fullName"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. John Doe"
                                        className="h-8.5 w-full rounded border border-border-default bg-white px-3.5 text-[13px] text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                    />
                                    {errors.fullName ? (
                                        <p className="mt-1 text-xs leading-5 text-red-600">
                                            {errors.fullName}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="reg-contact" className="text-[13px] font-medium text-text-primary">
                                        Contact Number
                                    </label>
                                    <input
                                        id="reg-contact"
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+92 300 1234567"
                                        className="h-8.5 w-full rounded border border-border-default bg-white px-3.5 text-[13px] text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                    />
                                    {errors.contactNumber ? (
                                        <p className="mt-1 text-xs leading-5 text-red-600">
                                            {errors.contactNumber}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="reg-email" className="text-[13px] font-medium text-text-primary">
                                    Email Address
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="hello@example.com"
                                    className="h-8.5 w-full rounded border border-border-default bg-white px-3.5 text-[13px] text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
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
                                <label htmlFor="reg-password" className="text-[13px] font-medium text-text-primary">
                                    Password
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="........"
                                    className="h-8.5 w-full rounded border border-border-default bg-white px-3.5 text-[13px] text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-black"
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

                            <label
                                htmlFor="reg-isSeller"
                                className="flex cursor-pointer items-start gap-3 rounded border border-border-light bg-bg-secondary px-3 py-2"
                            >
                                <div className="relative mt-0.5 flex-shrink-0">
                                    <input
                                        id="reg-isSeller"
                                        type="checkbox"
                                        name="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="peer sr-only"
                                        disabled={isSubmitting}
                                    />
                                    <div
                                        className="flex h-4 w-4 items-center justify-center border transition-all duration-200"
                                        style={{
                                            borderColor: formData.isSeller ? '#1A1A1A' : '#D4D4D4',
                                            backgroundColor: formData.isSeller ? '#1A1A1A' : 'transparent',
                                        }}
                                    >
                                        {formData.isSeller ? (
                                            <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : null}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium text-text-primary">Register as Seller</p>
                                    <p className="mt-0.5 text-[11px] leading-4 text-text-secondary">
                                        Enable seller access if you want to manage inventory.
                                    </p>
                                </div>
                            </label>

                            {formError ? (
                                <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                                    {formError}
                                </p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded bg-black px-8 py-2 text-[13px] font-normal text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-border-light" />
                                <span className="text-xs text-text-muted">or</span>
                                <div className="h-px flex-1 bg-border-light" />
                            </div>

                            <ContinueWithGoogle compact />

                            <p className="text-center text-[11px] text-text-secondary">
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                                    className="text-text-primary underline underline-offset-4 transition-all duration-300 hover:text-black"
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
