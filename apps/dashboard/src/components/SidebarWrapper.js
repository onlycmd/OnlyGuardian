'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function SidebarWrapper({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </>
    );
}
