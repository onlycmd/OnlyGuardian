import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '../../../../packages/database/index.js';
import { SocketService } from '../services/socketService.js';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Audit Log Mirroring İşleyicisi (Worker)
 */
const logWorker = new Worker('audit-log-mirroring', async job => {
    const { guildId, discordLogId, action, userId, targetId, reason, changes, createdAt } = job.data;

    try {
        await prisma.auditLog.upsert({
            where: { discordLogId },
            update: {}, // Zaten varsa güncelleme yapma
            create: {
                guildId,
                discordLogId,
                action: String(action),
                userId,
                targetId,
                reason,
                changes: changes || {},
                createdAt: new Date(createdAt)
            }
        });
    } catch (error) {
        console.error(`❌ [Worker Error] Audit Log kaydedilemedi: ${discordLogId}`, error);
        throw error;
    }
}, { connection });

/**
 * Tehdit Analiz İşleyicisi (Worker)
 */
const threatWorker = new Worker('threat-analysis', async job => {
    const { guildId, userId, content, timestamp } = job.data;

    // Örnek Phishing Tespiti (Basit Regex)
    const phishingRegex = /(discord-gift|nitro-app|free-nitro|steam-community)/i;

    if (phishingRegex.test(content)) {
        await prisma.threat.create({
            data: {
                guildId,
                userId,
                type: 'PHISHING',
                level: 'CRITICAL',
                description: `Şüpheli bağlantı tespit edildi: ${content}`,
                evidence: { content, timestamp }
            }
        });

        // Dashboard'a anlık bildirim gönder
        SocketService.emit('new-threat', {
            guildId,
            userId,
            type: 'PHISHING',
            level: 'CRITICAL',
            description: `Şüpheli bağlantı tespit edildi: ${content}`,
            timestamp
        });

        // Burada otomatik aksiyon (ban/kick) için moderationQueue'ya iş eklenebilir.
        console.log(`🚨 [Threat Detected] Phishing: ${userId} (Sunucu: ${guildId})`);
    }
}, { connection });

console.log('👷 BullMQ Workerlar Çalışıyor...');

export { logWorker, threatWorker };
