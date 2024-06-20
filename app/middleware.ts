import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define your password
const PASSWORD = process.env.PASSWORD
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g., / or /about)
  const { pathname } = request.nextUrl;

  // If the pathname is the main route
  if (pathname === "/") {
    const passwordCookie = request.cookies.get("password");

    // If the password cookie doesn't match, redirect to a login page
    if (!passwordCookie || passwordCookie.value !== PASSWORD) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // Only apply the middleware to the main route
};
