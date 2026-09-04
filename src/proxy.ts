import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
    // 1. Auth Checks
	const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");
	const session = !!sessionCookie;

	const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth") || request.nextUrl.pathname.startsWith("/api/setup");
    const isLoginRoute = request.nextUrl.pathname.includes("/login");

	if (isAuthRoute) {
		return NextResponse.next();
	}

	if (!session && !isLoginRoute) {
        // Must go to login. We'll redirect to /login and let intl handle adding the locale.
		return NextResponse.redirect(new URL("/login", request.url));
	}
    
    // Removed the redirect to "/" if session exists on login route to prevent 
    // infinite redirect loops when the session cookie is stale but valid in DB check.

    // 2. Internationalization (next-intl)
    // Run the intl middleware to handle locale detection and redirection
	return intlMiddleware(request);
}

export const config = {
	matcher: ['/((?!_next|.*\\..*|api/auth).*)'],
};
