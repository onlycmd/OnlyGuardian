import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Redis bağlantısı
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Olayları işlemek için ana kuyruklar
 */
export const logQueue = new Queue('audit-log-mirroring', { connection });
export const threatQueue = new Queue('threat-analysis', { connection });
export const moderationQueue = new Queue('moderation-actions', { connection });

console.log('🚀 BullMQ Kuyrukları Başlatıldı');
