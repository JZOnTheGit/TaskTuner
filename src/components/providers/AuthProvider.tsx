'use client';

import { useEffect } from 'react';
import { initSupabaseAuthListener } from '@/lib/supabase-client';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initSupabaseAuthListener();
  }, []);

  return <>{children}</>;
} 