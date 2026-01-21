import { Server } from 'socket.io';
import { createServer } from 'http';
import { SecurityService } from './securityService.js';

/**
 * Real-time iletişim için Socket.io Sunucusu
 */
export class SocketService {
    static io = null;

    /**
     * Socket sunucusunu başlatır.
     * @param {number} port 
     */
    static init(port = 3001) {
        const httpServer = createServer();
        this.io = new Server(httpServer, {
            cors: {
                origin: '*', // Üretimde dashboard URL'i ile kısıtlanmalı
                methods: ['GET', 'POST']
            }
        });

        // Kimlik Doğrulama Middleware
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (SecurityService.verifyToken(token)) {
                next();
            } else {
                next(new Error('Yetkisiz bağlantı!'));
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`🔌 Yeni Dashboard Bağlantısı: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`🔌 Dashboard Bağlantısı Kesildi: ${socket.id}`);
            });
        });

        httpServer.listen(port, () => {
            console.log(`📡 Socket.io Sunucusu Port ${port} üzerinde çalışıyor.`);
        });
    }

    /**
     * Dashboard'a olay gönderir.
     * @param {string} event 
     * @param {object} data 
     */
    static emit(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}
