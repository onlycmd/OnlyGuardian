import { NextResponse } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'onlyguardian_dashboard_secret_456'
);

export async function middleware(request) {
    const token = request.cookies.get('og_session')?.value;

    // Login sayfasındaysak ve token varsa ana sayfaya at
    if (request.nextUrl.pathname === '/login') {
        if (token) {
            try {
                await jose.jwtVerify(token, JWT_SECRET);
                return NextResponse.redirect(new URL('/', request.url));
            } catch (e) {
                // Geçersiz token, login'de kal
            }
        }
        return NextResponse.next();
    }

    // Diğer sayfalar için token kontrolü
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jose.jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch (error) {
        console.error('❌ Middleware JWT Hatası:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Sadece dashboard sayfalarında çalışsın
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
