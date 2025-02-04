import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const pathname = req.nextUrl.pathname;
  console.log('🔵 Middleware checking path:', pathname);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🟡 Session check:', { 
      hasSession: !!session, 
      path: pathname,
      user: session?.user?.email 
    });

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!session) {
        console.log('🔴 No session, redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
      }
      console.log('✅ Session valid, allowing dashboard access');
    }

    // Redirect from auth pages if logged in
    if (session && (pathname === '/login' || pathname === '/signup')) {
      console.log('🔄 User logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (error) {
    console.error('🔴 Middleware error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*'],
}; 