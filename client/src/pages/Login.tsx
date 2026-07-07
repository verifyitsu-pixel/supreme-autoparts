import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Navbar, Footer } from "@/components/Layout";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const { login, loginWithGoogle, loginWithApple, isLoading, error } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-md mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign in to your Supreme Autoparts account</p>
          </div>

          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error || localError}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E42933] text-white py-3 rounded-lg font-semibold hover:bg-[#d41f28] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="text-center mt-3">
              <Link href="/forgot-password" className="text-sm text-[#E42933] font-semibold hover:underline">
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
              Google
            </button>

            <button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c-.91 2.92-.46 5.25 1.31 6.82.24.2.48.39.72.56.9.64 1.71 1.22 1.17 2.55-.23.52-.74.86-1.35.86-.3 0-.61-.07-.92-.22-1.64-.77-2.58-2.3-2.98-4.63-.4 2.33-1.34 3.86-2.98 4.63-.31.15-.62.22-.92.22-.61 0-1.12-.34-1.35-.86-.54-1.33.27-1.91 1.17-2.55.24-.17.48-.36.72-.56 1.77-1.57 2.22-3.9 1.31-6.82-.91-2.92-3.4-5.05-6.32-5.05-2.92 0-5.41 2.13-6.32 5.05-.91 2.92-.46 5.25 1.31 6.82.24.2.48.39.72.56.9.64 1.71 1.22 1.17 2.55-.23.52-.74.86-1.35.86-.3 0-.61-.07-.92-.22-1.64-.77-2.58-2.3-2.98-4.63-.4 2.33-1.34 3.86-2.98 4.63-.31.15-.62.22-.92.22-.61 0-1.12-.34-1.35-.86-.54-1.33.27-1.91 1.17-2.55.24-.17.48-.36.72-.56 1.77-1.57 2.22-3.9 1.31-6.82C2.4 5.63 4.89 3.5 7.81 3.5c2.92 0 5.41 2.13 6.32 5.05z" />
              </svg>
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => setLocation("/register")}
              className="text-[#E42933] font-semibold hover:underline"
            >
              Sign up here
            </button>
          </p>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 mb-4">
              Browse without an account
            </p>
            <button
              onClick={() => setLocation("/products")}
              className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
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
