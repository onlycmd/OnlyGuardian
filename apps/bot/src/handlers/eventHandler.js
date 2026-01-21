import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Discord olaylarını dinamik olarak yükler ve kaydeder.
 * @param {import('discord.js').Client} client - Discord Bot Client'ı
 */
export async function registerEvents(client) {
    const eventsPath = join(__dirname, '../events');

    // Events klasörü yoksa oluştur
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = join(eventsPath, file);
        const { default: event } = await import(`file://${filePath}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        console.log(`✅ Olay Yüklendi: ${event.name}`);
    }
}
