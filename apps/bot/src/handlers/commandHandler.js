import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Slash komutlarını dinamik olarak yükler.
 * @param {import('discord.js').Client} client 
 */
export async function registerCommands(client) {
    const commandsPath = join(__dirname, '../commands');

    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
    }

    const categories = fs.readdirSync(commandsPath);

    for (const category of categories) {
        const categoryPath = join(commandsPath, category);
        if (!fs.lstatSync(categoryPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = join(categoryPath, file);
            const { default: command } = await import(`file://${filePath}`);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`[COMMAND] ✅ Yüklendi: ${command.data.name}`);
            } else {
                console.warn(`[COMMAND] ⚠️ ${filePath} dosyasında 'data' veya 'execute' eksik.`);
            }
        }
    }
}
