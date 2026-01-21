import { Events } from 'discord.js';

/**
 * Etkileşim (Interaction) Olayı
 * Slash komutlarını ve diğer UI etkileşimlerini (butonlar vb.) yönetir.
 */
export default {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Sadece Slash Komutlarını işle
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`[INTERACTION] ❌ Komut bulunamadı: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`[INTERACTION] ❌ Hata: ${interaction.commandName}`, error);

            const errorMessage = {
                content: 'Bu komutu çalıştırırken bir hata oluştu!',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
