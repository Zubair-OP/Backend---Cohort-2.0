"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerApi } from "@/apis/auth.api";
import { LogoIcon } from "@/components/home/ui";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await registerApi({ name, email, password });
      router.push("/login");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const resErr = err as { response?: { data?: { message?: string } } };
        setError(resErr.response?.data?.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-on-surface font-sans flex">
      {/* Left Panel: Compact Centered Form Container (Fits 100vh) */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-12 bg-surface z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-sm mx-auto my-auto py-6">
          {/* Brand Header */}
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Scriber Builder</h1>
          </Link>

          <h2 className="text-2xl font-bold text-on-surface mb-1">Create an account</h2>
          <p className="text-xs text-on-surface-variant mb-6">
            Join 5M+ professionals building their future.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1" htmlFor="fullname">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 bg-surface-subtle border border-surface-variant rounded-lg focus:ring-1 focus:ring-primary-container focus:bg-white text-xs text-on-surface placeholder-on-surface-variant transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 bg-surface-subtle border border-surface-variant rounded-lg focus:ring-1 focus:ring-primary-container focus:bg-white text-xs text-on-surface placeholder-on-surface-variant transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1" htmlFor="password">
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
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-surface-variant rounded-lg pr-9 focus:ring-1 focus:ring-primary-container focus:bg-white text-xs text-on-surface placeholder-on-surface-variant transition-all outline-none"
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

            <div className="flex items-start pt-1">
              <div className="flex items-center h-4">
                <input
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="focus:ring-primary-container h-3.5 w-3.5 text-primary-container border-outline-variant rounded bg-surface-subtle cursor-pointer"
                />
              </div>
              <div className="ml-2 text-xs">
                <label htmlFor="terms" className="text-on-surface-variant cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors flex justify-center items-center shadow-xs disabled:opacity-50 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Hero Quote Panel (Fits 100vh) */}
      <div className="hidden lg:block relative flex-1 h-full bg-surface-container-low overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 via-surface to-primary-container/5"></div>
        {/* Abstract brand pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(19, 171, 103) 1px, transparent 0px)",
            backgroundSize: "36px 36px",
          }}
        ></div>
        {/* Centered content area */}
        <div className="relative h-full flex items-center justify-center p-8 z-10">
          <div className="max-w-md bg-white/50 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-xl">
            <span
              className="material-symbols-outlined text-primary-container text-3xl mb-4 block fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <h3 className="text-lg font-semibold text-on-surface mb-6 leading-snug italic">
              &quot;Scriber Builder transformed how I present my experience. The templates are spotless.&quot;
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">
                MR
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Michael R.</p>
                <p className="text-[11px] text-on-surface-variant">Senior Designer</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative brand accent */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -mr-32 -mb-32"></div>
      </div>
    </div>
  );
}
