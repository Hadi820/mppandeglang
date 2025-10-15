# Supabase Setup Guide

## Prerequisites
- Akun Supabase (gratis di [supabase.com](https://supabase.com))
- Node.js terinstall

## Langkah-langkah Setup

### 1. Buat Project Supabase Baru
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Klik "New Project"
3. Isi detail project:
   - Name: `mpp-pandeglang`
   - Database Password: (simpan password ini)
   - Region: Southeast Asia (Singapore) - untuk performa terbaik
4. Tunggu project selesai dibuat (~2 menit)

### 2. Dapatkan API Credentials
1. Di dashboard project, klik "Settings" (ikon gear)
2. Pilih "API" di sidebar
3. Copy nilai berikut:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon/public key** (key yang panjang)

### 3. Setup Database Schema
1. Di dashboard Supabase, klik "SQL Editor" di sidebar
2. Klik "New Query"
3. Copy seluruh isi file `supabase/schema.sql` dari project ini
4. Paste ke SQL Editor
5. Klik "Run" untuk execute query
6. Tunggu hingga selesai (akan muncul "Success" message)

### 4. Seed Data Awal
1. Masih di SQL Editor, buat query baru
2. Copy seluruh isi file `supabase/seed.sql`
3. Paste dan klik "Run"
4. Verifikasi data berhasil di-insert dengan query:
   ```sql
   SELECT * FROM agencies;
   SELECT * FROM services;
   SELECT * FROM users;
   ```

### 5. Konfigurasi Environment Variables
1. Buka file `.env.local` di root project
2. Update dengan credentials Supabase Anda:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. **PENTING**: Jangan commit file `.env.local` ke Git!

### 6. Install Dependencies & Run
```bash
npm install
npm run dev
```

## Verifikasi Setup

### Test Database Connection
Setelah aplikasi berjalan:
1. Buka browser ke `http://localhost:3000`
2. Anda harus melihat loading spinner, lalu data instansi muncul
3. Jika ada error, check console browser (F12)

### Test Admin Login
1. Klik "Admin" di footer
2. Login dengan:
   - Username: `admin`
   - Password: `password123`
3. Anda harus bisa masuk ke dashboard admin

### Test CRUD Operations
1. Di admin dashboard, coba tambah instansi baru
2. Tambah layanan ke instansi
3. Edit dan hapus layanan
4. Refresh halaman - data harus tetap ada (tidak hilang)

## Troubleshooting

### Error: "Invalid API key"
- Pastikan `SUPABASE_ANON_KEY` di `.env.local` benar
- Pastikan tidak ada spasi di awal/akhir key

### Error: "relation does not exist"
- Schema belum di-run atau gagal
- Ulangi langkah 3 (Setup Database Schema)
- Check di Supabase Dashboard > Table Editor apakah tabel sudah ada

### Data tidak muncul
- Seed data belum di-run
- Ulangi langkah 4 (Seed Data Awal)
- Check di Table Editor apakah ada data

### RLS (Row Level Security) Error
- Jika ada error "new row violates row-level security policy"
- Pastikan RLS policies sudah dibuat (ada di schema.sql)
- Untuk development, bisa temporary disable RLS:
  ```sql
  ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;
  ALTER TABLE services DISABLE ROW LEVEL SECURITY;
  ```
  **JANGAN disable RLS di production!**

## Database Structure

### Tables
- **users**: Admin users untuk authentication
- **agencies**: Instansi pemerintah (Dukcapil, SAMSAT, dll)
- **services**: Layanan per instansi
- **mpp_profile**: Profil MPP (jam buka, kontak, dll)
- **chat_logs**: Log interaksi chatbot untuk analytics

### Relationships
```
agencies (1) ----< (many) services
```

## Security Notes

### Production Checklist
- [ ] Ganti password default admin
- [ ] Enable RLS pada semua tabel
- [ ] Setup proper authentication (bukan plaintext password)
- [ ] Gunakan environment variables untuk API keys
- [ ] Setup backup database otomatis
- [ ] Monitor usage di Supabase Dashboard

### API Key Security
- **ANON KEY**: Aman untuk client-side (sudah di-expose)
- **SERVICE ROLE KEY**: JANGAN PERNAH expose ke client!
- Untuk production, pertimbangkan:
  - Supabase Auth untuk user management
  - Row Level Security policies yang lebih ketat
  - Rate limiting

## Backup & Restore

### Manual Backup
```bash
# Export schema
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres --schema-only > backup_schema.sql

# Export data
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres --data-only > backup_data.sql
```

### Restore
```bash
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup_schema.sql
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup_data.sql
```

## Next Steps

1. **Implement proper authentication**
   - Gunakan Supabase Auth
   - Hash passwords dengan bcrypt
   - Implement JWT tokens

2. **Optimize queries**
   - Add indexes untuk kolom yang sering di-query
   - Use Supabase realtime untuk live updates

3. **Add file upload**
   - Gunakan Supabase Storage untuk logo instansi
   - Implement image optimization

4. **Setup monitoring**
   - Enable Supabase logs
   - Setup alerts untuk errors
   - Monitor database performance

## Support

Jika ada masalah:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Check console browser untuk error messages
3. Check Supabase Dashboard > Logs untuk server errors
