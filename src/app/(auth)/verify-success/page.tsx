'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifySuccessPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-black/30 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-red-600">Verification Failed</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {errorDescription || 'There was an error verifying your email. Please try again.'}
          </p>

          <Link
            href="/login"
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  // Success view remains the same
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-black/30 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold">Email Verified!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your email has been successfully verified. You can now log in to your account.
        </p>

        <Link
          href="/login"
          className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
} 