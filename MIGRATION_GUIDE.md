# Migration Guide: localStorage to Supabase

Panduan ini menjelaskan perubahan dari versi sebelumnya (menggunakan localStorage/mock data) ke versi baru (menggunakan Supabase).

## 🔄 Apa yang Berubah?

### Before (Old Version)
```typescript
// Data disimpan di state/localStorage
const [agencies, setAgencies] = useState(AGENCIES_DATA);

// CRUD operations langsung update state
const handleSaveService = () => {
  setAgencies(prev => /* update state */);
};
```

### After (New Version)
```typescript
// Data di-fetch dari Supabase
const [agencies, setAgencies] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const data = await fetchAgencies();
    setAgencies(data);
  };
  loadData();
}, []);

// CRUD operations call Supabase API
const handleSaveService = async () => {
  await createService(agencyId, service);
  // Then update local state
};
```

## 📊 Data Migration

### Automatic Migration
Tidak perlu migrasi manual! Data seed sudah disediakan di `supabase/seed.sql`.

### Custom Data Migration
Jika Anda punya data custom di localStorage:

1. **Export data lama** (sebelum update):
```javascript
// Di browser console
const agencies = JSON.parse(localStorage.getItem('agencies'));
console.log(JSON.stringify(agencies, null, 2));
// Copy output
```

2. **Convert ke SQL INSERT**:
```sql
-- Contoh untuk agencies
INSERT INTO agencies (name, logo) VALUES
  ('Nama Instansi', 'https://logo-url.com/logo.png');

-- Contoh untuk services
INSERT INTO services (
  agency_id, 
  nama_layanan, 
  persyaratan, 
  sistem_mekanisme_prosedur,
  jangka_waktu,
  lokasi_gerai
) VALUES (
  'agency-uuid-here',
  'Nama Layanan',
  ARRAY['Syarat 1', 'Syarat 2'],
  ARRAY['Step 1', 'Step 2'],
  '1 Hari',
  'Loket 1'
);
```

3. **Run di Supabase SQL Editor**

## 🔧 Code Changes

### 1. Import Changes

**Before:**
```typescript
import { AGENCIES_DATA } from './constants';
```

**After:**
```typescript
import { fetchAgencies } from './services/supabaseService';
```

### 2. State Initialization

**Before:**
```typescript
const [agencies, setAgencies] = useState(AGENCIES_DATA);
```

**After:**
```typescript
const [agencies, setAgencies] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    const data = await fetchAgencies();
    setAgencies(data);
    setIsLoading(false);
  };
  loadData();
}, []);
```

### 3. CRUD Operations

**Before (Synchronous):**
```typescript
const handleSaveService = () => {
  setAgencies(prev => /* update */);
};
```

**After (Asynchronous):**
```typescript
const handleSaveService = async () => {
  try {
    await createService(agencyId, service);
    setAgencies(prev => /* update */);
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menyimpan');
  }
};
```

### 4. Authentication

**Before:**
```typescript
const handleLogin = (user, pass) => {
  const found = users.find(u => 
    u.username === user && u.password === pass
  );
  return !!found;
};
```

**After:**
```typescript
const handleLogin = async (user, pass) => {
  try {
    const authenticatedUser = await authenticateUser(user, pass);
    return !!authenticatedUser;
  } catch (error) {
    return false;
  }
};
```

## 🗂️ File Structure Changes

### New Files
```
lib/
  ├── supabase.ts          # Supabase client
  └── database.types.ts    # TypeScript types

services/
  └── supabaseService.ts   # All CRUD operations

supabase/
  ├── schema.sql           # Database schema
  └── seed.sql             # Initial data
```

### Modified Files
```
App.tsx                    # Added data fetching
components/
  ├── AdminDashboard.tsx   # Async CRUD operations
  ├── AnalyticsDashboard.tsx # Fetch from Supabase
  ├── LoginPage.tsx        # Async login
  └── ProfileSettings.tsx  # Async updates

vite.config.ts             # Added Supabase env vars
.env.local                 # Added Supabase credentials
```

### Removed Dependencies
```
constants.ts               # AGENCIES_DATA moved to database
services/analyticsService.ts # generateDummyChatLogs() not used
```

## 🎯 Feature Comparison

| Feature | Old Version | New Version |
|---------|-------------|-------------|
| Data Storage | localStorage/state | Supabase PostgreSQL |
| Data Persistence | Lost on clear cache | Permanent |
| Multi-user | No | Yes |
| Real-time sync | No | Possible (not implemented) |
| Analytics | Dummy data | Real data |
| Authentication | Client-side only | Database-backed |
| Scalability | Limited | High |

## ⚠️ Breaking Changes

### 1. Async Operations
Semua CRUD operations sekarang async. Update code yang memanggil functions ini:

```typescript
// ❌ Old
handleSaveService();

// ✅ New
await handleSaveService();
```

### 2. Loading States
Tambahkan loading states untuk UX yang lebih baik:

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Error Handling
Semua operations bisa throw errors. Wrap dengan try-catch:

```typescript
try {
  await supabaseOperation();
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
}
```

## 🔍 Testing Migration

### Checklist
- [ ] Data muncul setelah page load
- [ ] Tambah instansi baru berhasil
- [ ] Edit instansi berhasil
- [ ] Hapus instansi berhasil
- [ ] Tambah layanan berhasil
- [ ] Edit layanan berhasil
- [ ] Hapus layanan berhasil
- [ ] Login admin berhasil
- [ ] Update profile berhasil
- [ ] Analytics menampilkan data real
- [ ] Data persist setelah refresh
- [ ] Chat logging berfungsi

### Test Script
```bash
# 1. Fresh install
rm -rf node_modules package-lock.json
npm install

# 2. Setup Supabase (follow SUPABASE_SETUP.md)

# 3. Run app
npm run dev

# 4. Test all features above
```

## 🐛 Common Issues

### Issue: "Cannot read property of undefined"
**Cause**: Data belum loaded dari Supabase
**Fix**: Add loading state dan conditional rendering

```typescript
if (isLoading) return <LoadingSpinner />;
if (!data) return <EmptyState />;
return <DataDisplay data={data} />;
```

### Issue: "Invalid API key"
**Cause**: Supabase credentials salah
**Fix**: Check `.env.local` dan restart dev server

### Issue: Data tidak persist
**Cause**: Supabase operations gagal
**Fix**: Check browser console untuk errors, verify RLS policies

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Array Types](https://www.postgresql.org/docs/current/arrays.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Need Help?

1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Check browser console for errors
3. Check Supabase Dashboard > Logs
4. Open an issue on GitHub

## ✅ Migration Complete!

Setelah migration berhasil:
1. Test semua fitur
2. Backup database (lihat SUPABASE_SETUP.md)
3. Update documentation jika ada custom changes
4. Deploy to production

Happy coding! 🚀
