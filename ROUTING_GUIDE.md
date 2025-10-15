# Panduan Routing Aplikasi MPP Pandeglang

## 📍 Routes yang Tersedia

Aplikasi ini sekarang menggunakan **React Router** untuk navigasi berbasis URL.

### 1. **Halaman Utama** - `/`
- URL: `http://localhost:3001/`
- Deskripsi: Halaman utama dengan chatbot dan layanan MPP
- Akses: Publik (semua orang)

### 2. **Halaman Login** - `/login`
- URL: `http://localhost:3001/login`
- Deskripsi: Halaman login untuk admin
- Akses: Publik (redirect ke `/admin` jika sudah login)
- Fitur:
  - Form login dengan username dan password
  - Tombol "Kembali ke halaman utama"
  - Auto-redirect ke `/admin` setelah login berhasil

### 3. **Dashboard Admin** - `/admin`
- URL: `http://localhost:3001/admin`
- Deskripsi: Dashboard admin untuk mengelola data
- Akses: Hanya untuk admin yang sudah login
- Fitur:
  - Manajemen agencies dan services
  - Analytics dashboard
  - User management
  - Auto-redirect ke `/login` jika belum login

## 🔐 Cara Akses Login

### Metode 1: Langsung via URL (RECOMMENDED)
```
http://localhost:3001/login
```

### Metode 2: Keyboard Shortcut (DIHAPUS)
Keyboard shortcut `Ctrl+Shift+A` sudah dihapus untuk keamanan.

## 🔄 Flow Navigasi

```
┌─────────────┐
│   / (Home)  │
└──────┬──────┘
       │
       │ User ketik /login di URL
       ▼
┌─────────────┐
│   /login    │◄──── Redirect jika belum login
└──────┬──────┘
       │
       │ Login berhasil
       ▼
┌─────────────┐
│   /admin    │◄──── Protected route
└──────┬──────┘
       │
       │ Logout
       ▼
┌─────────────┐
│   /login    │
└─────────────┘
```

## 🛡️ Protected Routes

- `/admin` adalah protected route
- Jika user belum login, akan otomatis redirect ke `/login`
- Jika user sudah login dan akses `/login`, akan redirect ke `/admin`
- Session disimpan di `sessionStorage` (per-tab)

## 📝 Perubahan dari Versi Sebelumnya

### ❌ Dihapus:
- Tombol admin di footer
- Keyboard shortcut `Ctrl+Shift+A`

### ✅ Ditambahkan:
- React Router untuk URL-based navigation
- Route `/login` untuk akses login
- Route `/admin` untuk dashboard admin
- Auto-redirect berdasarkan status autentikasi
- Komponen `HomePage` terpisah untuk halaman utama

## 🚀 Cara Menjalankan

```bash
npm run dev
```

Kemudian buka:
- Halaman utama: http://localhost:3001/
- Login admin: http://localhost:3001/login
