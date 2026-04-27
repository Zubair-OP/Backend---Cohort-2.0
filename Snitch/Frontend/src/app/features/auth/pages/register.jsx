import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
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
        isSeller: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setErrors({});
            setFormError('');
            const response = await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                isSeller: formData.isSeller,
                fullname: formData.fullName
            });

            toast.success(response?.message || 'Account created successfully.');

            if (formData.isSeller === true) {
                navigate("/Dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Registration failed:", error);
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
        fontFamily: "'Inter', sans-serif"
    };

    const handleFocus = (e) => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur = (e) => { e.target.style.borderBottomColor = '#d0c5b5'; };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen flex flex-col lg:flex-row selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                {/* ── LEFT: Editorial Image Panel ── */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#f5f3f0' }}>
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
                        alt="Snitch Fashion Editorial"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        style={{ filter: 'brightness(0.97)' }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(27,24,20,0.62) 0%, rgba(27,24,20,0.08) 45%, transparent 100%)' }}
                    />
                    <div className="absolute inset-0 p-14 flex flex-col justify-between z-10">
                        <span
                            className="text-sm font-medium tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            Stitch.
                        </span>
                        <div>
                            <p
                                className="text-5xl xl:text-6xl font-light leading-[1.08] text-white mb-5"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Define your<br />
                                <em>aesthetic.</em>
                            </p>
                            <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                Join the exclusive movement of creators and brands redefining the modern fashion landscape.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Form Panel ── */}
                <div
                    className="w-full lg:w-1/2 flex items-center justify-center min-h-screen px-8 sm:px-14 lg:px-20 py-6 overflow-y-auto"
                    style={{ backgroundColor: '#fbf9f6' }}
                >
                    <div className="w-full max-w-sm">

                        {/* Mobile brand mark */}
                        <div className="lg:hidden mb-6">
                            <span
                                className="text-sm tracking-[0.35em] uppercase"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                            >
                                Stitch.
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-5">
                            <p
                                className="text-[10px] uppercase tracking-[0.22em] mb-2 font-medium"
                                style={{ color: '#C9A96E' }}
                            >
                                Welcome to Stitch
                            </p>
                            <h1
                                className="text-[2.2rem] xl:text-[2.8rem] font-light leading-[1.1]"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                Elevate Your Style
                            </h1>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-[0.85rem]">

                            {/* Full Name */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="reg-fullName"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                                    style={{ color: '#7A6E63' }}
                                >
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
                                    className="w-full bg-transparent outline-none py-2 text-sm transition-colors duration-300"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                {errors.fullName ? (
                                    <p className="text-[11px] leading-5 mt-1" style={{ color: '#b64848' }}>
                                        {errors.fullName}
                                    </p>
                                ) : null}
                            </div>

                            {/* Contact Number */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="reg-contact"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                                    style={{ color: '#7A6E63' }}
                                >
                                    Contact Number
                                </label>
                                <input
                                    id="reg-contact"
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-transparent outline-none py-2 text-sm transition-colors duration-300"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                {errors.contactNumber ? (
                                    <p className="text-[11px] leading-5 mt-1" style={{ color: '#b64848' }}>
                                        {errors.contactNumber}
                                    </p>
                                ) : null}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="reg-email"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                                    style={{ color: '#7A6E63' }}
                                >
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
                                    className="w-full bg-transparent outline-none py-2 text-sm transition-colors duration-300"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                {errors.email ? (
                                    <p className="text-[11px] leading-5 mt-1" style={{ color: '#b64848' }}>
                                        {errors.email}
                                    </p>
                                ) : null}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="reg-password"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                                    style={{ color: '#7A6E63' }}
                                >
                                    Password
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-transparent outline-none py-2 text-sm transition-colors duration-300"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                {errors.password ? (
                                    <p className="text-[11px] leading-5 mt-1" style={{ color: '#b64848' }}>
                                        {errors.password}
                                    </p>
                                ) : null}
                            </div>

                            {/* Register as Seller — minimal checkbox */}
                            <label
                                htmlFor="reg-isSeller"
                                className="flex items-center gap-4 cursor-pointer group"
                            >
                                <div className="relative flex-shrink-0">
                                    <input
                                        id="reg-isSeller"
                                        type="checkbox"
                                        name="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="peer sr-only"
                                        disabled={isSubmitting}
                                    />
                                    {/* Custom checkbox */}
                                    <div
                                        className="w-4 h-4 border transition-all duration-200 flex items-center justify-center peer-checked:border-[#C9A96E]"
                                        style={{
                                            borderColor: formData.isSeller ? '#C9A96E' : '#d0c5b5',
                                            backgroundColor: formData.isSeller ? '#C9A96E' : 'transparent'
                                        }}
                                    >
                                        {formData.isSeller && (
                                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#fbf9f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span
                                    className="text-[11px] uppercase tracking-[0.15em] transition-colors duration-200"
                                    style={{ color: formData.isSeller ? '#C9A96E' : '#7A6E63' }}
                                >
                                    Register as Seller
                                </span>
                            </label>

                            {formError ? (
                                <p className="text-[11px] leading-5" style={{ color: '#b64848' }}>
                                    {formError}
                                </p>
                            ) : null}

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 mt-1"
                                style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#C9A96E';
                                    e.currentTarget.style.color = '#1b1c1a';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#1b1c1a';
                                    e.currentTarget.style.color = '#fbf9f6';
                                }}
                            >
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px" style={{ backgroundColor: '#e4e2df' }} />
                                <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#B5ADA3' }}>or</span>
                                <div className="flex-1 h-px" style={{ backgroundColor: '#e4e2df' }} />
                            </div>

                            {/* Google SSO */}
                            <ContinueWithGoogle />

                            {/* Footer Link */}
                            <p className="text-center text-[11px]" style={{ color: '#B5ADA3' }}>
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    className="transition-colors duration-200"
                                    style={{ color: '#7A6E63', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                                    onMouseEnter={e => e.target.style.color = '#C9A96E'}
                                    onMouseLeave={e => e.target.style.color = '#7A6E63'}
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
