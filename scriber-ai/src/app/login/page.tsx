"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginApi } from "@/apis/auth.api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginApi({ email, password });
      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const resErr = err as { response?: { data?: { message?: string } } };
        setError(resErr.response?.data?.message || "Login failed. Please check your credentials.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-surface-subtle text-on-surface font-sans flex">
      {/* Left Side: Compact Centered Form Container (Fits 100vh) */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-12 bg-white border-r border-surface-variant relative z-10 shadow-xl overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-sm mx-auto my-auto py-6">
          {/* Brand Logo */}
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-container text-3xl fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              description
            </span>
            <h1 className="text-xl font-bold text-primary tracking-tight">
              CakeBuilder
            </h1>
          </Link>

          <h2 className="text-2xl font-bold mb-1 text-on-surface">Welcome back</h2>
          <p className="text-xs text-on-surface-variant mb-6">
            Please enter your details to sign in.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 border border-surface-variant rounded-lg bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:bg-white transition-colors text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-surface-variant rounded-lg bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:bg-white transition-colors text-xs pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 text-primary-container focus:ring-primary-container border-outline-variant rounded bg-surface-subtle cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-on-surface-variant cursor-pointer">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-xs font-medium text-primary-container hover:text-primary transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-container transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary-container hover:text-primary transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Hero Visual Panel (Fits 100vh) */}
      <div className="hidden lg:block relative flex-1 h-full bg-surface-container overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full object-cover bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAk7gJi56VTCVM0gx3uUmED8dcn-fZVjZOeBF9dtn2H65J8DvfL1E8hiXg61zcrN7FEAji3cph2nsQyzfqT9qD8XvJL-1U19uG84jroT2uRuV39HWPxv9DZ-R_vztAvoSJfVqvNvJrSNfE7PWMZxYB0wHhqk9s6hCDI-6ifWuB4XpYb6_h2VE_eD-OSnOTSFFGf6Sd7Rom_3vO0DVTWSnaBxZlCGW-DHtXiLFeaVhICyX19xV1TNmE50iSQUeKiTm818jzwrU3Tfih6')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply opacity-75"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl max-w-lg">
            <h2 className="text-2xl font-bold mb-2 leading-tight text-white">
              Build a resume that stands out.
            </h2>
            <p className="text-xs opacity-90 leading-relaxed text-white/90">
              Join thousands of professionals who have advanced their careers with our modern, structured resume builder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
