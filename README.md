# CekMusang64.id

Platform komunitas terpercaya untuk kolektor diecast di Indonesia. CekMusang64.id membantu para kolektor untuk memverifikasi riwayat transaksi dan menghindari penipuan dengan menyediakan database laporan transaksi bermasalah yang telah diverifikasi oleh admin.

## Fitur Utama

- **Pencarian Cepat:** Cari rekam jejak penjual atau pembeli berdasarkan nama, nomor WhatsApp, nomor rekening, e-wallet, atau link profil Facebook.
- **Lapor Transaksi Bermasalah:** Formulir multi-langkah yang mudah digunakan untuk melaporkan masalah transaksi lengkap dengan bukti.
- **Sistem Verifikasi:** Setiap laporan yang masuk akan ditinjau oleh admin untuk memastikan validitas bukti sebelum dipublikasikan.
- **Transparan & Aman:** Melindungi komunitas tanpa melabeli secara sepihak; hanya menampilkan fakta historis dari laporan pengguna.
- **Admin Dashboard:** Panel khusus untuk admin mengelola laporan, pengguna, dan kategori.

## Teknologi yang Digunakan

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Form Validation:** React Hook Form & Zod
- **Icons:** Lucide React

## Cara Menjalankan di Lokal (Development)

1. **Clone repository ini**
   ```bash
   git clone https://github.com/vinzyid/cekmusang64.git
   cd cekmusang64
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Atur Environment Variables**
   Buat file `.env.local` di folder *root* dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Jalankan Server Lokal**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Database (Supabase)

Skema database lengkap (termasuk Row Level Security/RLS dan Storage) tersedia di dalam direktori `supabase/migrations/`. Anda dapat langsung menjalankan file SQL tersebut di **SQL Editor** pada dashboard Supabase Anda.

## Kontribusi

Kami sangat menghargai kontribusi dari komunitas! Jika Anda menemukan *bug* atau memiliki ide fitur baru, silakan buat *issue* atau *pull request*.

## Dukung Pengembang

Platform ini dikembangkan secara mandiri untuk membantu ekosistem kolektor diecast. Jika Anda merasa terbantu, pertimbangkan untuk mendukung pengembang melalui:
[Tako.id/vinzy.id](https://tako.id/vinzy.id)

---
*Dibangun dengan ❤️ untuk komunitas Diecast Indonesia.*
