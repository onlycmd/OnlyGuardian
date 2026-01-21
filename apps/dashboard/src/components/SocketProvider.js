'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Botun socket sunucusuna bağlan (Port 3001)
        // Not: Gerçek senaryoda auth token handshake ile gönderilmeli
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
            auth: {
                token: 'dashboard_temp_token' // Bu kısım SecurityService ile üretilen JWT olmalı
            }
        });

        newSocket.on('connect', () => {
            console.log('📡 SIEM Real-time bağlantısı kuruldu.');
        });

        newSocket.on('new-threat', (data) => {
            toast.error('KRİTİK TEHDİT TESPİT EDİLDİ', {
                description: `${data.type}: ${data.description}`,
                duration: 10000,
            });
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
