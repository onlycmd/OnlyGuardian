import { SlashCommandBuilder, EmbedBuilder, version as djsVersion } from 'discord.js';
import os from 'os';

/**
 * /status komutu
 * Botun ve sistemin anlık durumunu gösterir.
 */
export default {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Sistem ve bot durumunu gösterir.'),

    async execute(interaction) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle('🛡️ OnlyGuardian Sistem Durumu')
            .setColor(0x3b82f6) // Mavi
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: '🤖 Bot Sürümü', value: 'v1.0.0', inline: true },
                { name: '📚 Discord.js', value: `v${djsVersion}`, inline: true },
                { name: '🟢 Çalışma Süresi', value: `${hours}s ${minutes}d ${seconds}s`, inline: true },
                { name: '💻 Bellek Kullanımı', value: `${memoryUsage} MB`, inline: true },
                { name: '🖥️ Toplam RAM', value: `${totalMemory} GB`, inline: true },
                { name: '📡 Gecikme (Ping)', value: `${interaction.client.ws.ping}ms`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'OnlyGuardian SIEM Platform' });

        await interaction.reply({ embeds: [embed] });
    }
};
