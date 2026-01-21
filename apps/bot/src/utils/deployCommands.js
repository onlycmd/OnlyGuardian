import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = join(__dirname, '../commands');
const categories = fs.readdirSync(commandsPath);

for (const category of categories) {
    const categoryPath = join(commandsPath, category);
    if (!fs.lstatSync(categoryPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = join(categoryPath, file);
        const { default: command } = await import(`file://${filePath}`);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🔄 ${commands.length} Slash komutu yükleniyor...`);

        // Global olarak komutları kaydet
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ ${data.length} Slash komutu başarıyla kaydedildi.`);
    } catch (error) {
        console.error('❌ Komutlar kaydedilirken hata oluştu:', error);
    }
})();
