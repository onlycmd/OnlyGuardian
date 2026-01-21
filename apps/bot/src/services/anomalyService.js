import IORedis from 'ioredis';
import { threatQueue } from '../queue/config.js';

const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Anomali Tespit Servisi (Spam ve Raid tespiti)
 */
export class AnomalyService {
    /**
     * Kullanıcının spam yapıp yapmadığını kontrol eder.
     * @param {string} guildId 
     * @param {string} userId 
     * @param {number} threshold - Maksimum mesaj sayısı
     * @param {number} window - Zaman penceresi (saniye)
     */
    static async checkSpam(guildId, userId, threshold = 5, window = 5) {
        const key = `spam:${guildId}:${userId}`;
        const count = await redis.incr(key);

        if (count === 1) {
            await redis.expire(key, window);
        }

        if (count > threshold) {
            // Tehdit kuyruğuna ekle
            await threatQueue.add('spam-detected', {
                guildId,
                userId,
                type: 'SPAM',
                count,
                timestamp: new Date()
            });
            return true;
        }
        return false;
    }

    /**
     * Sunucuya hızlı giriş (Raid) yapılıp yapılmadığını kontrol eder.
     * @param {string} guildId 
     * @param {number} threshold - Dakikada maksimum giriş
     */
    static async checkRaid(guildId, threshold = 10) {
        const key = `raid:${guildId}`;
        const count = await redis.incr(key);

        if (count === 1) {
            await redis.expire(key, 60); // 1 dakikalık pencere
        }

        if (count > threshold) {
            await threatQueue.add('raid-detected', {
                guildId,
                type: 'RAID',
                count,
                timestamp: new Date()
            });
            return true;
        }
        return false;
    }
}
