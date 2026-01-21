import { Events } from 'discord.js';
import { threatQueue } from '../queue/config.js';
import { ShadowBanService } from '../services/shadowBanService.js';
import { AnomalyService } from '../services/anomalyService.js';

/**
 * @type {import('../types').Event}
 */
export default {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        // 1. SHADOW BAN KONTROLÜ (Redis tabanlı hızlı kontrol)
        const isShadowBanned = await ShadowBanService.isUserShadowBanned(message.guild.id, message.author.id);

        if (isShadowBanned) {
            // Mesajı anında sil (Kullanıcı fark etmeden)
            await message.delete().catch(() => {
                // SELF-HEALING: Yetki hatası varsa dashboard'a bildir
                console.error(`❌ Yetki Hatası: ${message.guild.id} sunucusunda shadow ban mesajı silinemedi.`);
            });
            return;
        }

        // 2. TEHDİT ANALİZİ (BullMQ Kuyruğuna Aktar)
        // Mesaj içeriğini ve kullanıcı verilerini analiz için kuyruğa gönderiyoruz.
        // Bu sayede botun ana thread'i bloklanmaz.
        await threatQueue.add('analyze-message', {
            guildId: message.guild.id,
            userId: message.author.id,
            content: message.content,
            channelId: message.channel.id,
            timestamp: new Date()
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
        });

        // 3. ANOMALİ TESPİTİ (Spam Kontrolü)
        await AnomalyService.checkSpam(message.guild.id, message.author.id);
    }
};
