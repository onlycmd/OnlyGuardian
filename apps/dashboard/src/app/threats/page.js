import { prisma } from '@onlyguardian/database';
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import { ShieldAlert, Clock, User as UserIcon, Globe } from 'lucide-react';

/**
 * Tehditler Sayfası (Server Component)
 * Veritabanındaki tüm tehditleri listeler.
 */
export default async function ThreatsPage() {
    const threats = await prisma.threat.findMany({
        include: {
            user: true,
            guild: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 50, // Son 50 tehdit
    });

    const getBadgeColor = (level) => {
        switch (level) {
            case 'CRITICAL': return 'red';
            case 'HIGH': return 'orange';
            case 'MEDIUM': return 'yellow';
            case 'LOW': return 'blue';
            default: return 'slate';
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Tehdit Analiz Merkezi</h1>
                <p className="text-slate-400">Sistem tarafından tespit edilen tüm şüpheli aktiviteler ve anomali kayıtları.</p>
            </div>

            <Card className="glass-card">
                <div className="flex items-center justify-between mb-6">
                    <Title className="text-white flex items-center">
                        <ShieldAlert className="w-5 h-5 mr-2 text-red-500" />
                        Son Tespit Edilen Tehditler
                    </Title>
                    <Badge color="red" size="xs">Canlı İzleme Aktif</Badge>
                </div>

                <Table className="mt-4">
                    <TableHead>
                        <TableRow className="border-b border-white/5">
                            <TableHeaderCell className="text-slate-400">Seviye</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Tür</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Kullanıcı</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Sunucu</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Açıklama</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Tarih</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {threats.map((threat) => (
                            <TableRow key={threat.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                <TableCell>
                                    <Badge color={getBadgeColor(threat.level)}>{threat.level}</Badge>
                                </TableCell>
                                <TableCell className="text-white font-medium">{threat.type}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-300">{threat.user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Globe className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-300">{threat.guild.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-slate-400">
                                    {threat.description}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2 text-slate-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(threat.createdAt).toLocaleString('tr-TR')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {threats.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                    Henüz bir tehdit tespit edilmedi. Sistem güvende!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
