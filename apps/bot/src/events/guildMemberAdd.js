import { Events } from 'discord.js';
import { AnomalyService } from '../services/anomalyService.js';

/**
 * Sunucuya yeni bir üye katıldığında tetiklenir.
 * Raid (Toplu Giriş) tespiti için kullanılır.
 */
export default {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Raid kontrolü yap
        const isRaid = await AnomalyService.checkRaid(member.guild.id);

        if (isRaid) {
            console.warn(`🚨 [RAID DETECTED] Sunucu: ${member.guild.name} (${member.guild.id})`);
            // Dashboard'a veya yetkili kanalına uyarı gönderilebilir.
        }
    }
};
