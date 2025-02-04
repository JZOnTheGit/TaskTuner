'use client';

import { Suspense } from 'react';
import LoginContent from '../../../components/auth/LoginContent';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

export const metadata = {
  title: 'Login - TaskTuner',
  description: 'Sign in to your TaskTuner account to manage your calendar and events.',
} 