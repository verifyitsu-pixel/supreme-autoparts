import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, loginWithGoogle, loginWithApple, loginWithFacebook, loginWithMicrosoft, isLoading, error } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      setLocation("/dashboard");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Apple login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-gray-600 text-base">Sign in to your Supreme Autoparts account</p>
          </div>

          {/* Error Alert */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error || localError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5 mb-8 bg-white rounded-xl shadow-lg p-8">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-2 focus:ring-[#E42933]/20 transition-all text-base"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-black text-gray-900 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#E42933] hover:text-[#d41f28] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-2 focus:ring-[#E42933]/20 transition-all text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E42933] text-white py-3 rounded-lg font-black uppercase tracking-wider hover:bg-[#d41f28] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-8">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full border-2 border-gray-200 bg-white py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-gray-700 hover:border-[#E42933]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-black uppercase tracking-wider">Google</span>
            </button>

            {/* Apple */}
            <button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full border-2 border-gray-200 bg-white py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-gray-700 hover:border-[#E42933]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c-.91 2.92-.46 5.25 1.31 6.82.24.2.48.39.72.56.9.64 1.71 1.22 1.17 2.55-.23.52-.74.86-1.35.86-.3 0-.61-.07-.92-.22-1.64-.77-2.58-2.3-2.98-4.63-.4 2.33-1.34 3.86-2.98 4.63-.31.15-.62.22-.92.22-.61 0-1.12-.34-1.35-.86-.54-1.33.27-1.91 1.17-2.55.24-.17.48-.36.72-.56 1.77-1.57 2.22-3.9 1.31-6.82-.91-2.92-3.4-5.05-6.32-5.05-2.92 0-5.41 2.13-6.32 5.05-.91 2.92-.46 5.25 1.31 6.82.24.2.48.39.72.56.9.64 1.71 1.22 1.17 2.55-.23.52-.74.86-1.35.86-.3 0-.61-.07-.92-.22-1.64-.77-2.58-2.3-2.98-4.63-.4 2.33-1.34 3.86-2.98 4.63-.31.15-.62.22-.92.22-.61 0-1.12-.34-1.35-.86-.54-1.33.27-1.91 1.17-2.55.24-.17.48-.36.72-.56 1.77-1.57 2.22-3.9 1.31-6.82C2.4 5.63 4.89 3.5 7.81 3.5c2.92 0 5.41 2.13 6.32 5.05z" />
              </svg>
              <span className="text-sm font-black uppercase tracking-wider">Apple</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => loginWithFacebook()}
              disabled={isLoading}
              className="w-full border-2 border-gray-200 bg-[#1877F2] py-3 rounded-lg font-semibold hover:bg-[#166fe5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-black uppercase tracking-wider">Facebook</span>
            </button>

            {/* Microsoft */}
            <button
              onClick={() => loginWithMicrosoft()}
              disabled={isLoading}
              className="w-full border-2 border-gray-200 bg-white py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-gray-700 hover:border-[#E42933]"
            >
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              <span className="text-sm font-black uppercase tracking-wider">Microsoft</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#E42933] font-black hover:text-[#d41f28] transition-colors uppercase tracking-wider"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Guest Browse */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <p className="text-center text-xs text-gray-600 font-semibold uppercase tracking-wider mb-4">
              Or browse without an account
            </p>
            <button
              onClick={() => setLocation("/products")}
              className="w-full border-2 border-gray-300 py-3 rounded-lg font-black hover:bg-gray-50 transition-all text-gray-700 uppercase tracking-wider text-sm"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
