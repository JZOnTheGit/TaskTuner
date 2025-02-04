'use client';

import { Suspense } from 'react';
import VerifySuccessContent from '../../../components/auth/VerifySuccessContent';

export default function VerifySuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifySuccessContent />
    </Suspense>
  );
} 