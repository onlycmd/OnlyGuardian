import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { prisma } from '@onlyguardian/database';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    try {
        // 1. Code -> Access Token değişimi
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: AUTH_CONFIG.clientId,
                client_secret: AUTH_CONFIG.clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: AUTH_CONFIG.redirectUri,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokens = await tokenResponse.json();
        if (tokens.error) throw new Error(tokens.error_description);

        // 2. Kullanıcı bilgilerini al
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const userData = await userResponse.json();

        // 3. Kullanıcıyı veritabanına kaydet/güncelle
        const user = await prisma.user.upsert({
            where: { id: userData.id },
            update: {
                username: userData.username,
                avatar: userData.avatar,
            },
            create: {
                id: userData.id,
                username: userData.username,
                avatar: userData.avatar,
            },
        });

        // 4. JWT oluştur
        const sessionToken = jwt.sign(
            { userId: user.id, username: user.username },
            AUTH_CONFIG.jwtSecret,
            { expiresIn: '7d' }
        );

        // 5. Cookie'ye kaydet ve dashboard'a yönlendir
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.set('og_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 hafta
        });

        return response;

    } catch (error) {
        console.error('❌ Auth Hatası:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
}
