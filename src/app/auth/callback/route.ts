import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('Callback params:', { code, error, errorDescription });

  // If there's an error in the URL, redirect to error page
  if (error) {
    console.error('URL contains error:', { error, errorDescription });
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || 'Verification failed')}`, requestUrl.origin)
    );
  }

  if (!code) {
    console.error('No code provided in URL');
    return NextResponse.redirect(
      new URL('/login?error=Invalid verification link', requestUrl.origin)
    );
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    console.log('Exchange response:', { data, error: sessionError });
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    // Verify the user's email is confirmed
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('User data:', { user, error: userError });

    if (userError) {
      console.error('User fetch error:', userError);
      throw userError;
    }

    if (!user?.email_confirmed_at) {
      console.error('Email not confirmed in user data');
      throw new Error('Email verification failed');
    }

    // Success! Redirect to success page
    return NextResponse.redirect(new URL('/verify-success', requestUrl.origin));

  } catch (error) {
    console.error('Verification process failed:', error);
    return NextResponse.redirect(
      new URL('/login?error=Verification failed', requestUrl.origin)
    );
  }
} 