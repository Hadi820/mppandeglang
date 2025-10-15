# Update Loading Animation

## 🎯 Perubahan

Loading animation telah diperbaiki dan dibuat lebih menarik dengan komponen `LoadingSpinner` yang reusable.

## ✨ Fitur Baru

### 1. **Komponen LoadingSpinner**
File: `components/LoadingSpinner.tsx`

Komponen loading yang dapat digunakan kembali dengan props:
- `message` - Pesan utama (default: "Memuat data...")
- `submessage` - Pesan tambahan (default: "Mohon tunggu sebentar")
- `size` - Ukuran spinner: 'sm' | 'md' | 'lg' (default: 'md')

### 2. **Animasi Multi-Layer**

#### Layer 1: Outer Ring (Ping)
- Border biru muda dengan efek ping
- Opacity 20%
- Memberikan efek "radiating" keluar

#### Layer 2: Middle Ring (Spin)
- Border biru dengan gradient
- Rotasi 360° continuous
- Border atas berwarna lebih gelap untuk efek loading

#### Layer 3: Inner Pulse
- Border biru dengan opacity 30%
- Efek pulse (fade in/out)
- Memberikan depth pada animasi

#### Layer 4: Center Dot
- Dot kecil di tengah
- Efek bounce
- Memberikan focal point

### 3. **Loading Dots**
Tiga dot di bawah teks dengan:
- Animasi bounce berurutan
- Delay berbeda untuk setiap dot (0ms, 150ms, 300ms)
- Memberikan efek "typing" atau "processing"

## 🎨 Visual Design

```
┌─────────────────────────┐
│                         │
│    ⭕ (Ping Ring)       │
│   ⭕⭕ (Spin Ring)      │
│  ⭕⭕⭕ (Pulse Ring)    │
│     • (Bounce Dot)      │
│                         │
│   Memuat data...        │
│   Mohon tunggu sebentar │
│                         │
│      • • •              │
│   (Loading Dots)        │
│                         │
└─────────────────────────┘
```

## 📍 Implementasi

### Analytics Dashboard
```tsx
<LoadingSpinner 
  message="Memuat data analitik..." 
  submessage="Menganalisis data pengguna" 
  size="lg" 
/>
```

### App.tsx (Initial Load)
```tsx
<LoadingSpinner 
  message="Memuat data..." 
  submessage="Menyiapkan layanan MPP Pandeglang" 
  size="lg" 
/>
```

### Custom Usage
```tsx
// Small spinner
<LoadingSpinner size="sm" />

// Medium spinner with custom message
<LoadingSpinner 
  message="Menyimpan data..." 
  submessage="Harap tunggu"
  size="md" 
/>

// Large spinner
<LoadingSpinner 
  message="Memproses..." 
  size="lg" 
/>
```

## 🎭 Animasi CSS

Semua animasi menggunakan CSS yang sudah ada di `index.css`:

### Spin Animation
```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Bounce Animation
```css
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

### Ping Animation (Tailwind built-in)
- Menggunakan `animate-ping` dari Tailwind CSS
- Efek scale dan fade out

## 📱 Responsive

### Size Variants

#### Small (sm)
- Spinner: 8x8 (2rem)
- Text: text-sm
- Subtext: text-xs
- Use case: Inline loading, small components

#### Medium (md) - Default
- Spinner: 16x16 (4rem)
- Text: text-xl
- Subtext: text-sm
- Use case: Modal, card loading

#### Large (lg)
- Spinner: 24x24 (6rem)
- Text: text-2xl
- Subtext: text-base
- Use case: Full page loading, initial app load

## 🎯 Benefits

### Before
- Simple spinner dengan 2 layer
- Tidak ada loading dots
- Tidak reusable
- Ukuran fixed

### After
- ✅ Multi-layer animation (4 layers)
- ✅ Loading dots dengan sequential animation
- ✅ Reusable component
- ✅ Customizable size
- ✅ Customizable messages
- ✅ Lebih engaging dan professional
- ✅ Consistent across app

## 🚀 Performance

- Pure CSS animations (GPU accelerated)
- No JavaScript animation loops
- Lightweight component
- No external dependencies

## 🎨 Color Scheme

- Primary: Blue-600 (#3B82F6)
- Secondary: Blue-500 (#3B82F6)
- Light: Blue-200 (#BFDBFE)
- Extra Light: Blue-100 (#DBEAFE)

Sesuai dengan brand color MPP Pandeglang.

## 💡 Tips

1. **Gunakan size yang sesuai**: 
   - `sm` untuk loading inline
   - `md` untuk modal/card
   - `lg` untuk full page

2. **Pesan yang jelas**: 
   - Message: Apa yang sedang dilakukan
   - Submessage: Instruksi atau info tambahan

3. **Konsistensi**: 
   - Gunakan komponen yang sama di seluruh aplikasi
   - Maintain consistent messaging

## 🔄 Future Enhancements

Possible improvements:
- Progress bar variant
- Skeleton loading variant
- Custom color themes
- Animation speed control
- Success/Error state transitions
