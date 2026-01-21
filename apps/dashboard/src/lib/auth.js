/**
 * Discord OAuth2 ve JWT Ayarları
 */
export const AUTH_CONFIG = {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    jwtSecret: process.env.JWT_SECRET || 'onlyguardian_dashboard_secret_456',
    scopes: ['identify', 'guilds'],
};

/**
 * Discord Yetkilendirme URL'sini oluşturur.
 */
export function getDiscordAuthUrl() {
    const params = new URLSearchParams({
        client_id: AUTH_CONFIG.clientId,
        redirect_uri: AUTH_CONFIG.redirectUri,
        response_type: 'code',
        scope: AUTH_CONFIG.scopes.join(' '),
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}
