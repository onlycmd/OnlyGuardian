import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarWrapper } from '@/components/SidebarWrapper';
import { SocketProvider } from '@/components/SocketProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'OnlyGuardian | Professional Discord SIEM',
    description: 'Discord sunucuları için gelişmiş tehdit analizi ve güvenlik platformu.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className="dark">
            <body className={`${inter.className} min-h-screen bg-[#020617]`}>
                <SocketProvider>
                    <div className="relative flex min-h-screen">
                        {/* Arka plan gradyanı */}
                        <div className="fixed inset-0 -z-10 h-full w-full bg-[#020617]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#0f172a,transparent)]" />
                        </div>

                        <SidebarWrapper>
                            {children}
                        </SidebarWrapper>
                    </div>
                    <Toaster position="top-right" theme="dark" richColors />
                </SocketProvider>
            </body>
        </html>
    );
}
