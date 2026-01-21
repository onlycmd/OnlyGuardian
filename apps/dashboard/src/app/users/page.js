import { prisma } from '@onlyguardian/database';
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, ProgressBar, Flex } from '@tremor/react';
import { Users as UsersIcon, Shield, AlertTriangle, UserCheck } from 'lucide-react';

/**
 * Kullanıcı Yönetimi Sayfası (Server Component)
 * Global tehdit skorlarına göre kullanıcıları listeler.
 */
export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            globalThreatScore: 'desc',
        },
        take: 50,
    });

    const getScoreColor = (score) => {
        if (score > 70) return 'red';
        if (score > 40) return 'orange';
        if (score > 10) return 'yellow';
        return 'emerald';
    };

    const getScoreIcon = (score) => {
        if (score > 70) return <Shield className="w-4 h-4 text-red-500" />;
        if (score > 40) return <AlertTriangle className="w-4 h-4 text-orange-500" />;
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Global Tehdit İstihbaratı</h1>
                <p className="text-slate-400">Kullanıcıların tüm sunuculardaki davranışlarına göre hesaplanan güvenlik skorları.</p>
            </div>

            <Card className="glass-card">
                <div className="flex items-center justify-between mb-6">
                    <Title className="text-white flex items-center">
                        <UsersIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Kullanıcı Güvenlik Veritabanı
                    </Title>
                </div>

                <Table className="mt-4">
                    <TableHead>
                        <TableRow className="border-b border-white/5">
                            <TableHeaderCell className="text-slate-400">Kullanıcı</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">ID</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Global Tehdit Skoru</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Durum</TableHeaderCell>
                            <TableHeaderCell className="text-slate-400">Kayıt Tarihi</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-500/20">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500 font-mono text-xs">{user.id}</TableCell>
                                <TableCell>
                                    <div className="w-40">
                                        <Flex>
                                            <Text className="text-xs text-slate-400">{user.globalThreatScore}%</Text>
                                            {getScoreIcon(user.globalThreatScore)}
                                        </Flex>
                                        <ProgressBar
                                            value={user.globalThreatScore}
                                            color={getScoreColor(user.globalThreatScore)}
                                            className="mt-2"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge color={getScoreColor(user.globalThreatScore)}>
                                        {user.globalThreatScore > 50 ? 'Şüpheli' : 'Güvenli'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                    Henüz kullanıcı kaydı bulunmuyor.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
