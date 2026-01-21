import { prisma } from '../../../../packages/database/index.js';
import { PermissionFlagsBits } from 'discord.js';

/**
 * Botun sunuculardaki sağlığını ve yetkilerini kontrol eden servis.
 */
export class HealthService {
    /**
     * Belirli bir sunucunun yetkilerini kontrol eder ve veritabanını günceller.
     * @param {import('discord.js').Guild} guild 
     */
    static async checkGuildHealth(guild) {
        try {
            const botMember = await guild.members.fetchMe();

            // Kritik yetkiler listesi
            const requiredPermissions = [
                PermissionFlagsBits.ViewAuditLog,
                PermissionFlagsBits.ModerateMembers,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.KickMembers
            ];

            const missingPermissions = requiredPermissions.filter(
                perm => !botMember.permissions.has(perm)
            );

            const hasError = missingPermissions.length > 0;
            const lastErrorMessage = hasError
                ? `Eksik Yetkiler: ${missingPermissions.join(', ')}`
                : null;

            // Veritabanını güncelle
            await prisma.guild.update({
                where: { id: guild.id },
                data: {
                    botPermissions: botMember.permissions.toArray(),
                    lastHealthCheck: new Date(),
                    hasError: hasError,
                    lastErrorMessage: lastErrorMessage
                }
            });

            if (hasError) {
                console.warn(`⚠️ [Self-Healing] Sunucu: ${guild.name} (${guild.id}) - Yetki Sorunu Tespit Edildi!`);
                // Burada Dashboard'a Socket.io ile anlık bildirim gönderilebilir.
            }

        } catch (error) {
            console.error(`❌ [HealthCheck Error] Sunucu ID: ${guild.id}`, error);
        }
    }

    /**
     * Tüm sunucuları periyodik olarak kontrol eder.
     * @param {import('discord.js').Client} client 
     */
    static async startGlobalHealthCheck(client) {
        console.log('🩺 Global Sağlık Kontrolü Başlatıldı (Her 1 saatte bir)');

        setInterval(async () => {
            for (const guild of client.guilds.cache.values()) {
                await this.checkGuildHealth(guild);
            }
        }, 1000 * 60 * 60); // 1 saat
    }
}
