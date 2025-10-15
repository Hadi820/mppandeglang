# 🔐 Session Management - Admin Dashboard

## Overview
Admin session sekarang persistent menggunakan sessionStorage. Admin tidak akan logout otomatis saat reload halaman, tetapi session hanya berlaku untuk tab yang sedang aktif.

## Fitur

### ✅ Session Persistence (Per-Tab)
- Session disimpan di `sessionStorage` dengan key: `mpp_admin_session`
- Session berisi informasi user dan timestamp
- Session otomatis di-load saat aplikasi dimuat
- **Session hanya berlaku untuk tab yang sedang aktif**
- Tab baru = harus login lagi

### ✅ Login Flow
1. User memasukkan username dan password
2. Sistem authenticate dengan Supabase
3. Jika berhasil:
   - User info disimpan ke state
   - Session disimpan ke localStorage
   - User diarahkan ke Admin Dashboard

### ✅ Logout Flow
1. User klik tombol "Logout" di Admin Dashboard
2. State di-clear
3. Session dihapus dari localStorage
4. User kembali ke halaman utama

### ✅ Auto-Login on Reload
1. Saat aplikasi dimuat, cek localStorage
2. Jika ada session yang valid:
   - Load user info dari session
   - Set authenticated state
   - Tampilkan Admin Dashboard
3. Jika tidak ada session:
   - Tampilkan halaman utama

## Implementation Details

### sessionStorage Structure
```javascript
{
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "admin",
    "created_at": "timestamp"
  },
  "timestamp": 1234567890
}
```

### localStorage vs sessionStorage

**sessionStorage (Current):**
- ✅ Per-tab isolation
- ✅ Cleared when tab closes
- ✅ More secure (not shared across tabs)
- ❌ Lost when tab closes

**localStorage (Previous):**
- ✅ Persistent across tabs
- ✅ Survives browser restart
- ❌ Shared across all tabs
- ❌ Less secure

### Code Changes

#### 1. Check Session on Mount (Per-Tab)
```typescript
useEffect(() => {
  const savedSession = sessionStorage.getItem('mpp_admin_session');
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      setCurrentUser(session.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading session:', error);
      sessionStorage.removeItem('mpp_admin_session');
    }
  }
}, []);
```

#### 2. Save Session on Login (Per-Tab)
```typescript
const handleLogin = async (user: string, pass: string): Promise<boolean> => {
  try {
    const authenticatedUser = await authenticateUser(user, pass);
    if (authenticatedUser) {
      setCurrentUser(authenticatedUser);
      setIsAuthenticated(true);
      setShowLogin(false);
      
      // Save session to sessionStorage (per-tab only)
      sessionStorage.setItem('mpp_admin_session', JSON.stringify({
        user: authenticatedUser,
        timestamp: Date.now()
      }));
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

#### 3. Clear Session on Logout
```typescript
const handleLogout = () => {
  setIsAuthenticated(false);
  setCurrentUser(null);
  
  // Clear session from sessionStorage
  sessionStorage.removeItem('mpp_admin_session');
};
```

## Security Considerations

### ✅ Current Implementation
- Session stored in sessionStorage (per-tab, client-side)
- No sensitive data (password) stored
- Session cleared on explicit logout
- Session cleared when tab closes
- Session NOT shared across tabs

### ⚠️ Limitations
- sessionStorage accessible via JavaScript
- No automatic session expiration (within tab lifetime)
- No server-side validation on reload
- Session lost when tab closes

### 🔒 Recommended Improvements (Optional)

#### 1. Session Expiration
```typescript
useEffect(() => {
  const savedSession = localStorage.getItem('mpp_admin_session');
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      const sessionAge = Date.now() - session.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > maxAge) {
        // Session expired
        localStorage.removeItem('mpp_admin_session');
        return;
      }
      
      setCurrentUser(session.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading session:', error);
      localStorage.removeItem('mpp_admin_session');
    }
  }
}, []);
```

#### 2. Session Token
Instead of storing user object, use a session token:
```typescript
// On login
const token = generateSecureToken();
localStorage.setItem('mpp_admin_token', token);

// On reload
const token = localStorage.getItem('mpp_admin_token');
if (token) {
  const user = await validateToken(token);
  if (user) {
    setCurrentUser(user);
    setIsAuthenticated(true);
  }
}
```

#### 3. Encrypted Storage
Use encryption for localStorage:
```typescript
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

// Save
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(session), 
  SECRET_KEY
).toString();
localStorage.setItem('mpp_admin_session', encrypted);

// Load
const encrypted = localStorage.getItem('mpp_admin_session');
const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
const session = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
```

## Testing

### Test Cases

1. **Login and Reload**
   - Login as admin
   - Reload page (F5)
   - ✅ Should stay logged in

2. **Logout**
   - Login as admin
   - Click logout button
   - ✅ Should return to main page
   - Reload page
   - ✅ Should stay on main page (not logged in)

3. **Multiple Tabs**
   - Login in Tab 1
   - Open Tab 2
   - ✅ Tab 2 should show admin dashboard

4. **Clear Storage**
   - Login as admin
   - Open DevTools → Application → localStorage
   - Delete `mpp_admin_session`
   - Reload page
   - ✅ Should return to main page

5. **Invalid Session**
   - Login as admin
   - Manually corrupt localStorage data
   - Reload page
   - ✅ Should handle error gracefully

## Browser Compatibility

✅ localStorage supported in:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- IE 8+
- Edge (all versions)
- Mobile browsers

## Storage Limits

- localStorage limit: ~5-10MB per domain
- Current session size: ~500 bytes
- No issues with storage limits

## Privacy

- Session data stored locally on user's device
- Not transmitted to server on every request
- Cleared when user logs out
- Can be cleared by user (browser settings)

## Troubleshooting

### Session Not Persisting
1. Check if localStorage is enabled in browser
2. Check browser console for errors
3. Verify localStorage in DevTools

### Session Lost After Reload
1. Check if localStorage data exists
2. Verify JSON parsing doesn't fail
3. Check for browser extensions blocking localStorage

### Multiple Users
- Only one session per browser
- Different browsers = different sessions
- Incognito mode = separate session

## Future Enhancements

1. ✨ Add session expiration (24 hours)
2. ✨ Add "Remember Me" checkbox
3. ✨ Add session activity tracking
4. ✨ Add multi-device session management
5. ✨ Add session encryption
6. ✨ Add server-side session validation

## Summary

✅ **Implemented:**
- Session persistence with localStorage
- Auto-login on reload
- Explicit logout only

✅ **Benefits:**
- Better UX (no need to re-login)
- Faster access to admin dashboard
- Simple implementation

⚠️ **Trade-offs:**
- Client-side storage (less secure)
- No automatic expiration
- No server-side validation

**Status: COMPLETE ✅**
