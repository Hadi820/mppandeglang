# 🔐 Skema Login & Session Management

## 📋 Ringkasan Sistem

### ✅ Yang Bisa Dilakukan:
1. **Admin bisa login** → Masuk ke Admin Dashboard
2. **Admin tetap login saat reload** → Tidak logout otomatis
3. **Logout hanya via button** → Harus klik tombol "Logout"
4. **Orang lain tetap bisa akses homepage** → Walaupun admin sedang login di tab lain

### 🔒 Keamanan:
- Session menggunakan **sessionStorage** (per-tab)
- Session **TIDAK** shared ke tab lain
- Tab baru = harus login lagi

---

## 🎯 Skenario Penggunaan

### Skenario 1: Admin Login
```
┌─────────────────────────────────────────┐
│ 1. User buka website                    │
│    → Tampil Homepage                    │
├─────────────────────────────────────────┤
│ 2. User tekan Ctrl+Shift+A              │
│    → Tampil halaman Login               │
├─────────────────────────────────────────┤
│ 3. User input username & password       │
│    → Klik "Login"                       │
├─────────────────────────────────────────┤
│ 4. Sistem validasi credentials          │
│    ✅ Benar → Simpan session            │
│    ✅ Benar → Tampil Admin Dashboard    │
│    ❌ Salah → Tampil error message      │
└─────────────────────────────────────────┘
```

### Skenario 2: Admin Reload Halaman
```
┌─────────────────────────────────────────┐
│ 1. Admin sudah login                    │
│    → Sedang di Admin Dashboard          │
├─────────────────────────────────────────┤
│ 2. Admin tekan F5 (Reload)              │
│    → Sistem cek sessionStorage          │
├─────────────────────────────────────────┤
│ 3. Session ditemukan                    │
│    ✅ Load user info dari session       │
│    ✅ Tetap di Admin Dashboard          │
│    ✅ TIDAK logout otomatis             │
└─────────────────────────────────────────┘
```

### Skenario 3: Admin Logout
```
┌─────────────────────────────────────────┐
│ 1. Admin di Admin Dashboard             │
│    → Klik tombol "Logout"               │
├─────────────────────────────────────────┤
│ 2. Sistem hapus session                 │
│    → Clear sessionStorage               │
├─────────────────────────────────────────┤
│ 3. Kembali ke Homepage                  │
│    → User bisa browse layanan           │
└─────────────────────────────────────────┘
```

### Skenario 4: Orang Lain Akses Homepage
```
┌─────────────────────────────────────────┐
│ TAB 1 (Admin)        TAB 2 (User Biasa) │
├──────────────────────┬──────────────────┤
│ Admin sudah login    │ Buka website     │
│ Di Admin Dashboard   │ → Homepage       │
│                      │                  │
│ ✅ Bisa kelola data  │ ✅ Bisa cari     │
│ ✅ Bisa edit         │    layanan       │
│ ✅ Bisa hapus        │ ✅ Bisa chat     │
│                      │ ✅ Bisa lihat    │
│                      │    info layanan  │
└──────────────────────┴──────────────────┘

TIDAK ADA KONFLIK! ✅
- Tab 1: Admin mode (ada session)
- Tab 2: User mode (tidak ada session)
- Keduanya berjalan independent
```

### Skenario 5: Admin Buka Tab Baru
```
┌─────────────────────────────────────────┐
│ TAB 1 (Admin Login)  TAB 2 (Tab Baru)   │
├──────────────────────┬──────────────────┤
│ Admin sudah login    │ Buka website     │
│ Di Admin Dashboard   │ → Homepage       │
│                      │                  │
│ Session: ✅ Ada      │ Session: ❌ Tidak│
│                      │                  │
│                      │ Untuk login:     │
│                      │ Tekan Ctrl+Shift+A│
└──────────────────────┴──────────────────┘

TAB BARU = HARUS LOGIN LAGI ✅
- sessionStorage tidak shared antar tab
- Setiap tab punya session sendiri
```

---

## 🔧 Cara Kerja Teknis

### 1. Login Process
```typescript
handleLogin(username, password)
  ↓
authenticateUser() // Validasi ke Supabase
  ↓
✅ Valid?
  ↓
setCurrentUser(user)
setIsAuthenticated(true)
  ↓
sessionStorage.setItem('mpp_admin_session', {
  user: {...},
  timestamp: Date.now()
})
  ↓
Tampil Admin Dashboard
```

### 2. Reload Process
```typescript
useEffect(() => {
  // Cek saat aplikasi dimuat
  const session = sessionStorage.getItem('mpp_admin_session')
  
  if (session) {
    // Session ada → Auto login
    setCurrentUser(session.user)
    setIsAuthenticated(true)
    // Tampil Admin Dashboard
  } else {
    // Session tidak ada → Homepage
    // User bisa browse normal
  }
}, [])
```

### 3. Logout Process
```typescript
handleLogout()
  ↓
setIsAuthenticated(false)
setCurrentUser(null)
  ↓
sessionStorage.removeItem('mpp_admin_session')
  ↓
Kembali ke Homepage
```

---

## 📊 State Management

### State Variables
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [currentUser, setCurrentUser] = useState(null)
const [showLogin, setShowLogin] = useState(false)
```

### State Flow
```
┌─────────────────────────────────────────┐
│ Initial State                           │
│ - isAuthenticated: false                │
│ - currentUser: null                     │
│ - showLogin: false                      │
│ → Tampil: Homepage                      │
└─────────────────────────────────────────┘
         ↓ (Ctrl+Shift+A)
┌─────────────────────────────────────────┐
│ Login Screen State                      │
│ - isAuthenticated: false                │
│ - currentUser: null                     │
│ - showLogin: true                       │
│ → Tampil: Login Page                    │
└─────────────────────────────────────────┘
         ↓ (Login Success)
┌─────────────────────────────────────────┐
│ Authenticated State                     │
│ - isAuthenticated: true                 │
│ - currentUser: {id, username, role}     │
│ - showLogin: false                      │
│ → Tampil: Admin Dashboard               │
└─────────────────────────────────────────┘
         ↓ (Logout)
┌─────────────────────────────────────────┐
│ Back to Initial State                   │
│ - isAuthenticated: false                │
│ - currentUser: null                     │
│ - showLogin: false                      │
│ → Tampil: Homepage                      │
└─────────────────────────────────────────┘
```

---

## 🎨 UI Flow

### Homepage (Default)
```
┌────────────────────────────────────────┐
│  🏛️ Layanan Informasi MPP Pandeglang  │
│                                        │
│  [Tanyakan layanan...]          [🔍]  │
│                                        │
│  📋 Daftar Layanan Instansi           │
│  ┌──────────┐ ┌──────────┐           │
│  │ BPJS     │ │ Disdukcap│           │
│  └──────────┘ └──────────┘           │
│                                        │
│  Footer                                │
└────────────────────────────────────────┘

Akses Admin: Ctrl+Shift+A
```

### Login Page
```
┌────────────────────────────────────────┐
│         🏛️ Admin Login                 │
│                                        │
│  Username: [____________]              │
│  Password: [____________]              │
│                                        │
│  [        Login        ]               │
│                                        │
│  ← Kembali ke halaman utama            │
└────────────────────────────────────────┘
```

### Admin Dashboard
```
┌────────────────────────────────────────┐
│  Admin Dashboard          [Logout]     │
│                                        │
│  📊 Statistik                          │
│  👥 Kelola User                        │
│  🏢 Kelola Instansi                    │
│  📋 Kelola Layanan                     │
│  💬 Log Chat                           │
└────────────────────────────────────────┘
```

---

## 🔐 Security Features

### ✅ Implemented
1. **Per-Tab Session** → sessionStorage
2. **No Password Storage** → Hanya user info
3. **Explicit Logout** → Via button only
4. **Session Validation** → Try-catch error handling
5. **Keyboard Shortcut** → Ctrl+Shift+A (hidden)

### 🛡️ Security Benefits
- Session tidak shared antar tab
- Session hilang saat tab ditutup
- Tidak ada data sensitif di storage
- Admin access tersembunyi (shortcut)

---

## 📱 Multi-Device Behavior

### Scenario: Admin Login di 2 Device
```
┌──────────────────┬──────────────────┐
│   Device 1       │   Device 2       │
│   (Laptop)       │   (HP)           │
├──────────────────┼──────────────────┤
│ Login → ✅       │ Login → ✅       │
│ Admin Dashboard  │ Admin Dashboard  │
│                  │                  │
│ Edit data → ✅   │ Edit data → ✅   │
│ Reload → ✅      │ Reload → ✅      │
│ Tetap login      │ Tetap login      │
│                  │                  │
│ Logout → ✅      │ (Masih login)    │
│ Kembali Homepage │ Tetap Dashboard  │
└──────────────────┴──────────────────┘

INDEPENDENT! ✅
- Setiap device punya session sendiri
- Logout di device 1 tidak affect device 2
```

---

## 🎯 Summary

### ✅ Fitur Utama
1. **Login Persistent** → Tetap login saat reload
2. **Logout Manual** → Hanya via button
3. **Per-Tab Session** → Tidak shared ke tab lain
4. **Homepage Accessible** → Orang lain tetap bisa akses

### 🔒 Keamanan
- sessionStorage (per-tab)
- No password storage
- Hidden admin access
- Explicit logout only

### 👥 User Experience
- Admin: Smooth workflow, tidak perlu login berulang
- User Biasa: Tidak terganggu, bisa akses normal
- Multi-Tab: Independent, tidak conflict

**Status: IMPLEMENTED ✅**
