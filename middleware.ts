import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/upload', '/profile']
// Routes that authenticated users should not access
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check for auth token — Zustand persist stores it in localStorage, which
    // is not accessible in middleware. We use a cookie as the authoritative
    // server-side signal (set by our authStore on login).
    const token = request.cookies.get('auth-token')?.value

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // Redirect unauthenticated users away from protected routes
    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from login/register
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/browse', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/upload/:path*', '/profile/:path*', '/login', '/register'],
}
