import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { config } from 'dotenv';
import { registerEvents } from './handlers/eventHandler.js';
import { registerCommands } from './handlers/commandHandler.js';
import './queue/workers.js'; // Worker'ları başlat
import { SocketService } from './services/socketService.js';

// .env dosyasını yükle
config();

/**
 * OnlyGuardian Discord Bot Client Yapılandırması
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildAuditLogEntryCreate, // Audit Log Mirroring için kritik
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
});

// Komutlar ve diğer koleksiyonlar için client üzerine eklemeler
client.commands = new Collection();

/**
 * Botu Başlat
 */
async function bootstrap() {
    try {
        console.log('🛡️ OnlyGuardian Bot Başlatılıyor...');

        // Olay Dinleyicilerini Kaydet
        await registerEvents(client);

        // Komutları Kaydet
        await registerCommands(client);

        // Socket.io Sunucusunu Başlat
        SocketService.init(process.env.SOCKET_PORT || 3001);

        // Discord'a Bağlan
        await client.login(process.env.DISCORD_TOKEN);

    } catch (error) {
        console.error('❌ Bot başlatılırken kritik hata:', error);
        process.exit(1);
    }
}

bootstrap();

export { client };
