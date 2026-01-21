import { prisma } from '@onlyguardian/database';
import { Card, Title, Text, AreaChart, Metric, Grid, BadgeDelta, Flex } from '@tremor/react';
import { ShieldAlert, ShieldCheck, Users, Activity } from 'lucide-react';

/**
 * Dashboard Ana Sayfası (Server Component)
 * Veritabanından gerçek verileri çekerek özet istatistikleri gösterir.
 */
export default async function DashboardPage() {
    // Veritabanından istatistikleri çek
    const [threatCount, logCount, userCount, guildCount] = await Promise.all([
        prisma.threat.count(),
        prisma.auditLog.count(),
        prisma.user.count(),
        prisma.guild.count(),
    ]);

    // Son 24 saatteki tehditleri çek (Grafik için)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentThreats = await prisma.threat.findMany({
        where: { createdAt: { gte: last24Hours } },
        select: { createdAt: true },
    });

    // Basit bir saatlik gruplama (Örnek veri formatı)
    const chartData = Array.from({ length: 12 }).map((_, i) => {
        const hour = new Date(Date.now() - (11 - i) * 2 * 60 * 60 * 1000);
        const label = `${hour.getHours()}:00`;
        return {
            date: label,
            'Tehditler': recentThreats.filter(t =>
                new Date(t.createdAt).getHours() === hour.getHours()
            ).length,
            'Loglar': Math.floor(Math.random() * 100) + 50, // Log verisi için örnek (gerçekte DB'den çekilmeli)
        };
    });

    const stats = [
        {
            title: 'Toplam Tehdit',
            metric: threatCount.toString(),
            delta: 'Canlı',
            deltaType: 'moderateIncrease',
            icon: ShieldAlert,
            color: 'red',
        },
        {
            title: 'Kayıtlı Kullanıcılar',
            metric: userCount.toString(),
            delta: '+5%',
            deltaType: 'increase',
            icon: Users,
            color: 'blue',
        },
        {
            title: 'Aktif Sunucular',
            metric: guildCount.toString(),
            delta: 'Stabil',
            deltaType: 'unchanged',
            icon: ShieldCheck,
            color: 'emerald',
        },
        {
            title: 'Arşivlenmiş Loglar',
            metric: `${(logCount / 1000).toFixed(1)}k`,
            delta: 'Kalıcı',
            deltaType: 'increase',
            icon: Activity,
            color: 'amber',
        },
    ];

    // Son 5 kritik olayı çek
    const latestIncidents = await prisma.threat.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, guild: true }
    });

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Sistem Özeti</h1>
                <p className="text-slate-400">OnlyGuardian SIEM platformu genel güvenlik durumu.</p>
            </div>

            {/* İstatistik Kartları */}
            <Grid numItemsMd={2} numItemsLg={4} className="gap-6">
                {stats.map((item) => (
                    <Card key={item.title} decoration="top" decorationColor={item.color} className="glass-card">
                        <Flex alignItems="start">
                            <div className="space-y-2">
                                <Text className="text-slate-400">{item.title}</Text>
                                <Metric className="text-white">{item.metric}</Metric>
                            </div>
                            <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
                        </Flex>
                    </Card>
                ))}
            </Grid>

            {/* Grafik Bölümü */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="glass-card">
                    <Title className="text-white">Tehdit ve Aktivite Analizi</Title>
                    <Text className="text-slate-400">Son 24 saatlik sistem yoğunluğu</Text>
                    <AreaChart
                        className="mt-4 h-72"
                        data={chartData}
                        index="date"
                        categories={['Tehditler', 'Loglar']}
                        colors={['red', 'blue']}
                        valueFormatter={(number) => Intl.NumberFormat('tr-TR').format(number).toString()}
                    />
                </Card>
            </div>

            {/* Son Olaylar Listesi */}
            <Card className="glass-card">
                <Title className="text-white">Son Kritik Tehditler</Title>
                <div className="mt-4 space-y-4">
                    {latestIncidents.map((threat) => (
                        <div key={threat.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${threat.level === 'CRITICAL' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                                    <ShieldAlert className={`w-5 h-5 ${threat.level === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{threat.type}</p>
                                    <p className="text-xs text-slate-400">
                                        Kullanıcı: {threat.user.username} • Sunucu: {threat.guild.name}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Text className="text-xs text-slate-500">
                                    {new Date(threat.createdAt).toLocaleTimeString('tr-TR')}
                                </Text>
                                <Text className="text-[10px] text-slate-600 uppercase tracking-wider">
                                    {threat.level}
                                </Text>
                            </div>
                        </div>
                    ))}
                    {latestIncidents.length === 0 && (
                        <Text className="text-center py-6 text-slate-500">Henüz bir tehdit kaydı bulunmuyor.</Text>
                    )}
                </div>
            </Card>
        </div>
    );
}
