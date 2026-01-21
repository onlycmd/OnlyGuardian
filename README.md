# 🛡️ OnlyGuardian - Discord SIEM Platform

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
## 🇺🇸 English

### Overview
Welcome! How about protecting your Discord server not just with a bot, but with a real cyber security intelligence center? **OnlyGuardian** is an enterprise-grade SIEM (Security Information and Event Management) platform developed specifically for Discord.

It's much more than an ordinary moderation bot; it's a massive ecosystem that detects anomalies, analyzes threats in real-time, and archives all logs permanently.

### ✨ Key Features
*   **🕵️ Threat Analysis Engine:** Instantly catches phishing links, spam waves, and suspicious activities.
*   **🌑 Shadow Ban:** Silently cleans up messages from suspicious users without them noticing. A total ghost operation!
*   **📜 Audit Log Mirroring:** Don't get stuck with Discord's 90-day log limit. We store all server movements forever in our own PostgreSQL database.
*   **🩺 Self-Healing:** Did the bot lose permissions? Is there an error? It warns you instantly via the dashboard and identifies the problem.
*   **📊 Premium Dashboard:** A sleek, dark interface designed with Next.js 14, Tremor, and Tailwind that rivals professional cybersecurity screens.
*   **⚡ Real-Time Alerts:** If a bird flies in your server, it appears instantly on the dashboard thanks to Socket.io.

### 🛠️ Tech Stack
- **Bot:** Discord.js v14 (ESM)
- **Frontend:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Performance & Queue:** Redis + BullMQ
- **UI:** Tailwind CSS + Shadcn UI + Tremor

### ⭐ Support Us!
We put a lot of effort into this project. If you like OnlyGuardian or learned something from it, leaving a **Star** would make us very happy! 

Also, feel free to **Fork** the project to add your own features. We look forward to your pull requests! 🚀

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

### Genel Bakış
Selamlar! Discord sunucunu sadece bir botla değil, gerçek bir siber güvenlik istihbarat merkeziyle korumaya ne dersin? **OnlyGuardian**, Discord sunucuları için geliştirilmiş, kurumsal düzeyde bir SIEM (Security Information and Event Management) platformudur.

Sıradan bir moderasyon botundan çok daha fazlası; anomali tespiti yapan, tehditleri gerçek zamanlı analiz eden ve tüm logları kalıcı olarak arşivleyen devasa bir ekosistem.

### ✨ Öne Çıkan Özellikler
*   **🕵️ Tehdit Analiz Motoru:** Phishing bağlantılarını, spam dalgalarını ve şüpheli aktiviteleri anında yakalar.
*   **🌑 Shadow Ban (Gölge Engelleme):** Şüpheli kullanıcıların mesajlarını, onlar fark etmeden sessizce temizler. Tam bir hayalet operasyonu!
*   **📜 Audit Log Mirroring:** Discord'un 90 günlük log sınırına takılma. Tüm sunucu hareketlerini kendi PostgreSQL tabanımızda sonsuza dek saklıyoruz.
*   **🩺 Self-Healing (Kendi Kendini Onarma):** Botun yetkisi mi düştü? Bir hata mı var? Dashboard üzerinden seni anında uyarır ve sorunu tespit eder.
*   **📊 Premium Dashboard:** Next.js 14, Tremor ve Tailwind ile hazırlanan, siber güvenlik uzmanlarının ekranlarını aratmayan şık ve karanlık arayüz.
*   **⚡ Real-Time Uyarılar:** Sunucunda bir kuş uçsa, Socket.io sayesinde dashboard ekranında anında belirir.

### 🛠️ Teknoloji Yığını
- **Bot:** Discord.js v14 (ESM)
- **Frontend:** Next.js 14 (App Router)
- **Veritabanı:** PostgreSQL + Prisma ORM
- **Hız & Kuyruk:** Redis + BullMQ
- **UI:** Tailwind CSS + Shadcn UI + Tremor

### ⭐ Destek Ol!
Bu projeyi geliştirmek için çok emek verdik dayı. Eğer OnlyGuardian hoşuna gittiyse veya projeden bir şeyler öğrendiysen, bir **Star (Yıldız)** bırakman bizi çok mutlu eder! 

Ayrıca projeyi **Fork**'layarak kendi özelliklerini ekleyebilir ve topluluğa katkıda bulunabilirsin. Pull request'lerini heyecanla bekliyoruz! 🚀

---

## 🚀 Installation / Kurulum

1.  **Clone the Repo / Depoyu Klonla:**
    ```bash
    git clone https://github.com/onlycmd/OnlyGuardian.git
    cd OnlyGuardian
    ```

2.  **Install Dependencies / Bağımlılıkları Yükle:**
    ```bash
    npm install
    ```

3.  **Setup Environment / Çevre Değişkenleri:**
    Rename `.env.example` to `.env` and fill in the blanks.
    `.env.example` dosyasını `.env` olarak değiştir ve içindeki alanları doldur.

4.  **Database Setup / Veritabanı Hazırlığı:**
    ```bash
    npx prisma generate --workspace=@onlyguardian/database
    npx prisma db push --workspace=@onlyguardian/database
    ```

5.  **Run / Çalıştır:**
    ```bash
    # Start Bot / Botu başlat
    npm run bot:dev
    
    # Start Dashboard / Dashboard'u başlat
    npm run dashboard:dev
    ```

---
*OnlyGuardian - Your Server's Strongest Shield / Sunucun İçin En Güçlü Kalkan.*

