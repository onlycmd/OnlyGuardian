import { prisma } from '@onlyguardian/database';
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Select, SelectItem } from '@tremor/react';
import { History, Search, Filter, Clock, Shield } from 'lucide-react';

/**
 * Audit Log Sayfası (Server Component)
 * Discord'dan aynalanan kalıcı logları listeler.
 */
export default async function LogsPage({ searchParams }) {
    // Basit arama ve filtreleme (Query params üzerinden)
    const query = searchParams?.q || '';

    const logs = await prisma.auditLog.findMany({
        where: {
            OR: [
                { action: { contains: query, mode: 'insensitive' } },
                { reason: { contains: query, mode: 'insensitive' } },
            ]
        },
        include: {
            user: true,
            guild: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 100, // Son 100 log
    });

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Audit Log Arşivi</h1>
                <p className="text-slate-400">Discord'un 90 günlük sınırını aşan, kalıcı olarak saklanan sunucu hareketleri.</p>
            </div>

            {/* Filtreleme Paneli */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <TextInput
                        icon={Search}
                        placeholder="Eylem veya sebep ara..."
                        className="glass-card border-none text-white"
                    />
                </div>
                <Select placeholder="Eylem Türü" className="glass-card border-none">
                    <SelectItem value="MEMBER_BAN">Üye Yasaklama</SelectItem>
                    <SelectItem value="MESSAGE_DELETE">Mesaj Silme</SelectItem>
                    <SelectItem value="CHANNEL_CREATE">Kanal Oluşturma</SelectItem>
                </Select>
                <Select placeholder="Sunucu Seç" className="glass-card border-none">
                    <SelectItem value="all">Tüm Sunucular</SelectItem>
                </Select>
            </div>

            <Card className="glass-card">
                <div className="flex items-center justify-between mb-6">
                    <Title className="text-white flex items-center">
                        <History className="w-5 h-5 mr-2 text-blue-500" />
                        Sistem Kayıtları
                    </Title>
                    <Text className="text-slate-500">{logs.length} kayıt listeleniyor</Text>
                </div>

                <Table className="mt-4">
                    <TableHead>
                        <TableRow className="border-b border-white/5">
                            <TableHeaderCell className="text-slate-400">Eylem</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Yetkili</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Hedef ID</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Sebep</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Sunucu</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Tarih</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                <TableCell>
                                    <Badge color="blue" icon={Shield}>{log.action}</Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-300 font-medium">
                                        {log.user?.username || 'Bilinmeyen Yetkili'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-slate-500 font-mono text-xs">
                                    {log.targetId || '-'}
                                </TableCell>
                                <TableCell className="text-slate-400 italic max-w-xs truncate">
                                    {log.reason || 'Sebep belirtilmedi'}
                                </TableCell>
                                <TableCell className="text-slate-300">
                                    {log.guild.name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2 text-slate-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(log.createdAt).toLocaleString('tr-TR')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                    Kayıt bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
