<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MPP Pandeglang Service Finder

Aplikasi web interaktif berbasis AI untuk membantu warga Kabupaten Pandeglang mencari informasi tentang persyaratan, proses, dan detail layanan publik di Mal Pelayanan Publik (MPP).

## 🚀 Fitur Utama

### User Features
- **AI Chatbot**: Powered by Google Gemini AI untuk menjawab pertanyaan seputar layanan publik
- **Service Directory**: Katalog lengkap layanan dari berbagai instansi (Dukcapil, SAMSAT, Imigrasi, Polres, BPJS)
- **Smart Search**: Autocomplete dan suggestions berdasarkan nama layanan
- **Responsive Design**: Optimal di desktop, tablet, dan mobile

### Admin Features
- **Dashboard Analytics**: Statistik penggunaan real-time dengan charts
- **CRUD Instansi**: Kelola instansi dan layanan dengan mudah
- **Profile Management**: Update informasi MPP (jam buka, kontak, dll)
- **User Management**: Kelola admin users

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini AI
- **Charts**: Custom React components

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)
- Gemini API Key (gratis dari Google AI Studio)

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd mpp-pandeglang-service-finder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase Database
Ikuti panduan lengkap di [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Quick steps:**
1. Buat project di [Supabase](https://supabase.com)
2. Run `supabase/schema.sql` di SQL Editor
3. Run `supabase/seed.sql` untuk data awal
4. Copy Project URL dan Anon Key

### 4. Configure Environment Variables
Buat file `.env.local` di root project:
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔐 Admin Access

### Cara Akses Admin Panel

Admin panel **tidak memiliki tombol di UI** untuk keamanan. Akses menggunakan keyboard shortcut:

**Windows/Linux**: `Ctrl + Shift + A`  
**macOS**: `Cmd + Shift + A`

### Default Credentials

```
Username: admin
Password: password123
```

**⚠️ PENTING**: Ganti password default setelah login pertama!

📖 **Detail lengkap**: Lihat [ADMIN_ACCESS.md](./ADMIN_ACCESS.md)

## 📁 Project Structure

```
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── ChatHistory.tsx
│   ├── ServiceGrid.tsx
│   ├── charts/         # Chart components
│   └── icons/          # SVG icon components
├── services/           # Service layer
│   ├── geminiService.ts      # Gemini AI integration
│   ├── supabaseService.ts    # Supabase CRUD operations
│   └── analyticsService.ts   # Analytics utilities
├── lib/                # Libraries & utilities
│   ├── supabase.ts           # Supabase client
│   └── database.types.ts     # TypeScript types
├── supabase/           # Database files
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Seed data
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
└── App.tsx             # Main app component
```

## 🗄️ Database Schema

### Tables
- **agencies**: Instansi pemerintah
- **services**: Layanan per instansi
- **users**: Admin users
- **mpp_profile**: Profil MPP
- **chat_logs**: Analytics data

Lihat detail di [supabase/schema.sql](./supabase/schema.sql)

## 🎯 Usage

### User Mode
1. Buka aplikasi di browser
2. Ketik pertanyaan di chat (contoh: "syarat buat KTP")
3. Atau klik kategori cepat / browse service grid
4. Klik layanan untuk detail lengkap

### Admin Mode
1. Klik "Admin" di footer
2. Login dengan credentials
3. Kelola instansi, layanan, dan profil MPP
4. Lihat analytics di tab "Analitik Pengguna"

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output akan ada di folder `dist/`

### Deploy Options
- **Vercel** (Recommended): `vercel deploy`
- **Netlify**: Drag & drop folder `dist`
- **Firebase Hosting**: `firebase deploy`

**Environment Variables**: Jangan lupa set di platform deployment!

## 🔒 Security Notes

### Development
- ✅ RLS (Row Level Security) enabled
- ✅ API keys via environment variables
- ⚠️ Password plaintext (untuk demo)

### Production Checklist
- [ ] Implement proper authentication (Supabase Auth)
- [ ] Hash passwords dengan bcrypt
- [ ] Setup rate limiting
- [ ] Enable HTTPS
- [ ] Setup monitoring & logging
- [ ] Regular database backups

## 🐛 Troubleshooting

### Data tidak muncul
- Check console browser (F12) untuk errors
- Verifikasi Supabase credentials di `.env.local`
- Pastikan seed data sudah di-run

### Gemini AI tidak merespons
- Check `GEMINI_API_KEY` valid
- Verifikasi quota API belum habis
- Check network connection

### Build errors
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

Lihat troubleshooting lengkap di [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 📊 Analytics

Dashboard analytics menampilkan:
- Total sesi chat
- Pengguna unik (estimasi)
- Pertanyaan tidak terjawab
- Waktu respons rata-rata
- Grafik aktivitas harian/bulanan
- Top keywords
- Service breakdown

Data diambil real-time dari tabel `chat_logs`

## 🤝 Contributing

Contributions welcome! Silakan:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Initial development by AI Studio
- Refactored with Supabase integration

## 🙏 Acknowledgments

- Google Gemini AI for chatbot capabilities
- Supabase for backend infrastructure
- Tailwind CSS for styling
- React team for the framework

## 📞 Support

Untuk pertanyaan atau issues:
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Open an issue di GitHub
3. Contact: mpp@pandeglangkab.go.id

---

**View original app in AI Studio**: https://ai.studio/apps/drive/1jnJB53l7tuehA9-C0NtrbQgPrQlIPRWZ
