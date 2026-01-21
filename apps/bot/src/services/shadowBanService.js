import IORedis from 'ioredis';
import { prisma } from '../../../../packages/database/index.js';

const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Shadow Ban (Gölge Engelleme) Yönetim Servisi
 */
export class ShadowBanService {
    static REDIS_KEY_PREFIX = 'shadowban:';

    /**
     * Bir kullanıcının shadow ban durumunu kontrol eder (Redis üzerinden hızlı kontrol).
     * @param {string} guildId 
     * @param {string} userId 
     * @returns {Promise<boolean>}
     */
    static async isUserShadowBanned(guildId, userId) {
        const key = `${this.REDIS_KEY_PREFIX}${guildId}:${userId}`;
        const cached = await redis.get(key);

        if (cached !== null) {
            return cached === 'true';
        }

        // Redis'te yoksa DB'den bak ve Redis'e yaz
        const ban = await prisma.shadowBan.findUnique({
            where: {
                guildId_userId: { guildId, userId }
            }
        });

        const isBanned = ban?.isActive || false;
        await redis.set(key, String(isBanned), 'EX', 3600); // 1 saat önbellekle

        return isBanned;
    }

    /**
     * Kullanıcıyı shadow ban listesine ekler.
     * @param {string} guildId 
     * @param {string} userId 
     * @param {string} reason 
     */
    static async addShadowBan(guildId, userId, reason) {
        await prisma.shadowBan.upsert({
            where: { guildId_userId: { guildId, userId } },
            update: { isActive: true, reason },
            create: { guildId, userId, reason, isActive: true }
        });

        const key = `${this.REDIS_KEY_PREFIX}${guildId}:${userId}`;
        await redis.set(key, 'true', 'EX', 3600);
    }

    /**
     * Shadow ban'i kaldırır.
     * @param {string} guildId 
     * @param {string} userId 
     */
    static async removeShadowBan(guildId, userId) {
        await prisma.shadowBan.update({
            where: { guildId_userId: { guildId, userId } },
            data: { isActive: false }
        });

        const key = `${this.REDIS_KEY_PREFIX}${guildId}:${userId}`;
        await redis.del(key);
    }
}
