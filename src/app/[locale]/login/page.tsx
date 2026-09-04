"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Failed to sign in");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-2xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white font-extrabold text-2xl tracking-tighter transform transition-all hover:scale-110 hover:rotate-3 duration-300">
            DM
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to the Dormitory Management System</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                placeholder="admin@dorm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-sm text-red-400 text-center font-medium">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-indigo-900 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-70 disabled:hover:scale-100"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="relative z-10 flex items-center gap-2">
                {loading ? "Authenticating..." : "Sign in to Dashboard"}
              </span>
            </button>
            <div className="mt-4">
               <PWAInstallPrompt />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
