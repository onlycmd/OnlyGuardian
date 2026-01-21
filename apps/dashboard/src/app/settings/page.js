import { prisma } from '@onlyguardian/database';
import { Card, Title, Text, Grid, TextInput, NumberInput, Switch, Button, Flex, Divider } from '@tremor/react';
import { Settings as SettingsIcon, Save, ShieldAlert, Zap, MessageSquare, UserPlus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

/**
 * Ayarlar Sayfası (Server Component)
 * Botun koruma eşiklerini ve modüllerini yapılandırır.
 */
export default async function SettingsPage() {
    // Not: Gerçek senaryoda burada aktif sunucu ID'si session'dan veya URL'den alınır.
    // Şimdilik ilk sunucuyu varsayılan alıyoruz.
    const guild = await prisma.guild.findFirst({
        include: { settings: true }
    });

    if (!guild) {
        return <div className="p-8 text-white">Sunucu bulunamadı. Botun en az bir sunucuda olması gerekir.</div>;
    }

    /**
     * Ayarları Kaydetme İşlemi (Server Action)
     */
    async function updateSettings(formData) {
        'use server';

        const raidThreshold = parseInt(formData.get('raidThreshold'));
        const spamThreshold = parseInt(formData.get('spamThreshold'));
        const antiRaidEnabled = formData.get('antiRaidEnabled') === 'on';
        const antiPhishingEnabled = formData.get('antiPhishingEnabled') === 'on';

        await prisma.guild.update({
            where: { id: guild.id },
            data: {
                antiRaidEnabled,
                antiPhishingEnabled,
                settings: {
                    upsert: {
                        create: { raidThreshold, spamThreshold },
                        update: { raidThreshold, spamThreshold }
                    }
                }
            }
        });

        revalidatePath('/settings');
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Sistem Yapılandırması</h1>
                <p className="text-slate-400">OnlyGuardian koruma modüllerini ve hassasiyet eşiklerini özelleştirin.</p>
            </div>

            <form action={updateSettings}>
                <Grid numItemsMd={1} numItemsLg={2} className="gap-8">

                    {/* Güvenlik Modülleri */}
                    <Card className="glass-card">
                        <Title className="text-white flex items-center">
                            <ShieldAlert className="w-5 h-5 mr-2 text-blue-500" />
                            Aktif Korumalar
                        </Title>
                        <Text className="text-slate-400 mb-6">Hangi güvenlik katmanlarının aktif olacağını seçin.</Text>

                        <div className="space-y-6">
                            <Flex>
                                <div className="space-y-0.5">
                                    <Text className="text-white font-medium">Anti-Raid Sistemi</Text>
                                    <Text className="text-xs text-slate-500">Hızlı sunucu girişlerini otomatik engeller.</Text>
                                </div>
                                <Switch name="antiRaidEnabled" defaultChecked={guild.antiRaidEnabled} />
                            </Flex>

                            <Divider className="bg-white/5" />

                            <Flex>
                                <div className="space-y-0.5">
                                    <Text className="text-white font-medium">Phishing Koruması</Text>
                                    <Text className="text-xs text-slate-500">Zararlı bağlantıları gerçek zamanlı analiz eder.</Text>
                                </div>
                                <Switch name="antiPhishingEnabled" defaultChecked={guild.antiPhishingEnabled} />
                            </Flex>

                            <Divider className="bg-white/5" />

                            <Flex>
                                <div className="space-y-0.5">
                                    <Text className="text-white font-medium">Shadow Ban Sistemi</Text>
                                    <Text className="text-xs text-slate-500">Şüpheli kullanıcıları sessizce izole eder.</Text>
                                </div>
                                <Switch name="shadowBanEnabled" defaultChecked={guild.shadowBanEnabled} />
                            </Flex>
                        </div>
                    </Card>

                    {/* Hassasiyet Eşikleri */}
                    <Card className="glass-card">
                        <Title className="text-white flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-amber-500" />
                            Anomali Eşikleri
                        </Title>
                        <Text className="text-slate-400 mb-6">Sistemin ne zaman alarm vereceğini belirleyin.</Text>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Flex>
                                    <Text className="text-white flex items-center">
                                        <UserPlus className="w-4 h-4 mr-2 text-slate-400" />
                                        Raid Eşiği (Giriş/Dakika)
                                    </Text>
                                </Flex>
                                <NumberInput
                                    name="raidThreshold"
                                    defaultValue={guild.settings?.raidThreshold || 10}
                                    className="bg-white/5 border-none text-white"
                                />
                                <Text className="text-xs text-slate-500">Dakikada bu sayıdan fazla giriş olursa RAID alarmı verilir.</Text>
                            </div>

                            <div className="space-y-2">
                                <Flex>
                                    <Text className="text-white flex items-center">
                                        <MessageSquare className="w-4 h-4 mr-2 text-slate-400" />
                                        Spam Eşiği (Mesaj/5 Saniye)
                                    </Text>
                                </Flex>
                                <NumberInput
                                    name="spamThreshold"
                                    defaultValue={guild.settings?.spamThreshold || 5}
                                    className="bg-white/5 border-none text-white"
                                />
                                <Text className="text-xs text-slate-500">5 saniyede bu sayıdan fazla mesaj SPAM olarak işaretlenir.</Text>
                            </div>
                        </div>
                    </Card>

                </Grid>

                <div className="mt-8 flex justify-end">
                    <Button
                        icon={Save}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 border-none px-8 py-6 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                        Ayarları Uygula
                    </Button>
                </div>
            </form>
        </div>
    );
}
