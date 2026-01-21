'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShieldAlert,
    History,
    Users,
    Settings,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tehditler', href: '/threats', icon: ShieldAlert },
    { name: 'Audit Log', href: '/logs', icon: History },
    { name: 'Kullanıcılar', href: '/users', icon: Users },
    { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col glass-card border-r-0">
            <div className="flex h-20 items-center px-6 space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">OnlyGuardian</span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                                isActive
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <item.icon className={cn(
                                'mr-3 h-5 w-5 transition-colors',
                                isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-200">
                    <LogOut className="mr-3 h-5 w-5" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}
