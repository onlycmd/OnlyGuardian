import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { ShadowBanService } from '../../services/shadowBanService.js';

/**
 * /shadowban komutu
 * Belirtilen kullanıcıyı gölge engelleme listesine ekler veya çıkarır.
 */
export default {
    data: new SlashCommandBuilder()
        .setName('shadowban')
        .setDescription('Bir kullanıcıyı gölge engelleme listesine ekler/çıkarır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(sub =>
            sub.setName('ekle')
                .setDescription('Kullanıcıyı shadow ban listesine ekler.')
                .addUserOption(opt => opt.setName('kullanici').setDescription('Engellenecek kullanıcı').setRequired(true))
                .addStringOption(opt => opt.setName('sebep').setDescription('Engelleme sebebi').setRequired(false))
        )
        .addSubcommand(sub =>
            sub.setName('kaldir')
                .setDescription('Kullanıcının shadow banını kaldırır.')
                .addUserOption(opt => opt.setName('kullanici').setDescription('Banı kaldırılacak kullanıcı').setRequired(true))
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('kullanici');
        const guildId = interaction.guildId;

        const embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ text: 'OnlyGuardian Security System' });

        if (subcommand === 'ekle') {
            const reason = interaction.options.getString('sebep') || 'Belirtilmedi';
            await ShadowBanService.addShadowBan(guildId, targetUser.id, reason);

            embed.setTitle('🛡️ Shadow Ban Uygulandı')
                .setDescription(`${targetUser} kullanıcısı artık gölge engelli. Mesajları sessizce silinecek.`)
                .setColor(0xffa500) // Turuncu
                .addFields({ name: 'Sebep', value: reason });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else if (subcommand === 'kaldir') {
            await ShadowBanService.removeShadowBan(guildId, targetUser.id);

            embed.setTitle('✅ Shadow Ban Kaldırıldı')
                .setDescription(`${targetUser} kullanıcısının gölge engeli kaldırıldı.`)
                .setColor(0x00ff00); // Yeşil

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
