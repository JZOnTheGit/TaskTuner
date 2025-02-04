'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';

type AuthFormProps = {
  mode: 'login' | 'signup' | 'forgot';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (mode === 'login') {
        console.log('🔵 Login attempt started');

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (error) {
            if (error.message.includes('Email not confirmed')) {
              throw new Error('Please check your email and click the verification link to activate your account.');
            }
            throw error;
          }

          if (data.session) {
            console.log('🟢 Login successful');
            setUser(data.user);
            window.location.href = '/dashboard';
          }
        } catch (err) {
          throw err; // Re-throw to be caught by outer catch block
        }
      } else if (mode === 'signup') {
        console.log('Starting signup process...', { email: formData.email });
        
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Sign up attempt
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify-success`
          }
        });

        console.log('Signup response:', { data, error: signUpError });

        if (signUpError) throw signUpError;

        setUser(data.user);
        router.push('/verify-email');
      } else if (mode === 'forgot') {
        console.log('Starting password reset for:', formData.email);
        
        if (!formData.email.trim()) {
          throw new Error('Please enter your email address');
        }

        console.log('Attempting password reset with email:', formData.email);

        const { data, error } = await supabase.auth.resetPasswordForEmail(
          formData.email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        console.log('Reset password response:', { data, error });

        if (error) throw error;

        setSuccess('Password reset email sent. Please check your inbox.');
        setFormData({ ...formData, email: '' });

        return (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded">
            {success}
          </div>
        );
      }
    } catch (err) {
      console.error('🔴 Login error:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Error during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-black/30 rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          {mode === 'login' && 'Sign in to your account'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' && (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded">
            {success}
          </div>
        )}

        {mode !== 'forgot' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {mode !== 'forgot' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {mode === 'forgot' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {mode === 'login' && (
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              {mode === 'login' && 'Sign in'}
              {mode === 'signup' && 'Sign up'}
              {mode === 'forgot' && 'Reset password'}
            </>
          )}
        </button>
      </form>
    </div>
  );
} 