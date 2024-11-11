import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  // If the user is not logged in and trying to access a page other than login or register
  if (!token && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/register')) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login page
  }

  // If the user is logged in and trying to access the login or register page, redirect them to the home page
  if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home page (or any page after login)
  }

  return NextResponse.next(); // Proceed to the requested page
}

export const config = {
  matcher: ['/', '/login', '/register', '/blog/:path*'], // Define the paths where this middleware will apply
};
