import { Events } from 'discord.js';
import { logQueue } from '../queue/config.js';

/**
 * Discord Audit Log Mirroring (Aynalama) Olayı
 * Discord'un 90 günlük sınırını aşmak için logları kendi veritabanımıza kopyalarız.
 */
export default {
    name: Events.GuildAuditLogEntryCreate,
    async execute(auditLog, guild) {
        try {
            // Log verisini BullMQ kuyruğuna ekle (Veritabanı yazma işlemini asenkron yapıyoruz)
            await logQueue.add('mirror-audit-log', {
                guildId: guild.id,
                discordLogId: auditLog.id,
                action: auditLog.actionType, // Not: discord.js v14'te actionType veya action kullanılır
                userId: auditLog.executorId,
                targetId: auditLog.targetId,
                reason: auditLog.reason,
                changes: auditLog.changes,
                createdAt: new Date(auditLog.createdTimestamp)
            }, {
                removeOnComplete: true,
                attempts: 5,
                backoff: { type: 'exponential', delay: 2000 }
            });

            console.log(`📝 Audit Log Kuyruğa Eklendi: ${auditLog.id} (Sunucu: ${guild.id})`);
        } catch (error) {
            console.error('❌ Audit Log Aynalama Hatası:', error);
        }
    }
};
