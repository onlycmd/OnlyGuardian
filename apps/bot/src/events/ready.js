import { Events } from 'discord.js';
import { HealthService } from '../services/healthService.js';
import { prisma } from '../../../../packages/database/index.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`🚀 Bot Hazır! Giriş Yapıldı: ${client.user.tag}`);

        // 1. Sunucu Verilerini Senkronize Et
        for (const guild of client.guilds.cache.values()) {
            await prisma.guild.upsert({
                where: { id: guild.id },
                update: {
                    name: guild.name,
                    icon: guild.icon,
                    ownerId: guild.ownerId
                },
                create: {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon,
                    ownerId: guild.ownerId
                }
            });

            // İlk sağlık kontrolünü yap
            await HealthService.checkGuildHealth(guild);
        }

        // 2. Periyodik Sağlık Kontrolünü Başlat
        HealthService.startGlobalHealthCheck(client);

        console.log('📊 Tüm sunucular senkronize edildi ve sağlık kontrolleri tamamlandı.');
    }
};
