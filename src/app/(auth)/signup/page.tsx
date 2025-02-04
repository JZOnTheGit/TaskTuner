'use client';

import { Suspense } from 'react';
import SignupContent from '../../../components/auth/SignupContent';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
} 