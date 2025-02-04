'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (searchParams.get('message') === 'email-confirmed') {
      setMessage('Email confirmed successfully! Please log in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });

      if (signInError) throw signInError;

      if (data.user) {
        setUser(data.user);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!form.email) {
        throw new Error('Please enter your email address');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess('Check your email for password reset instructions');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err.message : 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 flex flex-col">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm sm:text-base"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="ml-2">Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <Image
                src="/images/logo-no-background.png"
                alt="TaskTuner Logo"
                width={200}
                height={50}
                className="h-12 w-auto mx-auto mb-6"
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-gray-400 text-sm sm:text-base">Sign in to your account</p>
            </div>

            {message && (
              <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-400">Password</label>
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm sm:text-base">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 