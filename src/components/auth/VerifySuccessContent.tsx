'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifySuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Email Verified!</h1>
        <p className="text-gray-400 mb-6">
          {email ? `${email} has been verified.` : 'Your email has been verified.'} You can now log in to your account.
        </p>
        <Link
          href="/login?message=email-confirmed"
          className="inline-block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );
} 