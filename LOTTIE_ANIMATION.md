# 🎬 Dokumentasi Animasi Gradient Text

## 📋 Overview

Aplikasi ini menggunakan animasi CSS murni untuk memberikan efek visual yang menarik pada hero section. Animasi yang digunakan adalah **Gradient Text Animation** dengan efek stacked glow dan pulsing shadow.

## 🔧 Implementasi Teknis

### 1. Zero Dependencies

Tidak ada package eksternal yang diperlukan. Semua animasi menggunakan CSS murni.

### 2. File CSS

**Lokasi:** `public/gradient-text-stacked.css`

```css
.gradient-text {
  position: relative;
  font-size: 72px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "Poppins", sans-serif;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(90deg, #0af260, #00e0ff, #007bff, #ffffff);
  background-size: 300% 100%;
  animation: moveGradient 4s ease-in-out infinite;
}

/* Efek stacked layer (bayangan berlapis) */
.gradient-text::before,
.gradient-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  color: rgba(255, 255, 255, 0.08);
  transform-origin: top left;
}

/* Layer bawah bergerak halus */
.gradient-text::before {
  transform: translate(6px, 6px) scale(1.02);
  filter: blur(2px);
  animation: pulseShadow 3s ease-in-out infinite alternate;
}

/* Layer tengah sedikit redup */
.gradient-text::after {
  transform: translate(3px, 3px) scale(1.01);
  color: rgba(255, 255, 255, 0.15);
}

@keyframes moveGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulseShadow {
  0% {
    opacity: 0.2;
    transform: translate(6px, 6px) scale(1.02);
  }
  100% {
    opacity: 0.4;
    transform: translate(8px, 8px) scale(1.05);
  }
}
```

### 3. Komponen AnimatedText

**Lokasi:** `components/AnimatedText.tsx`

```tsx
import React from 'react';

const AnimatedText: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full px-4">
      <h1 
        className="gradient-text" 
        data-text="AI Layanan Informasi"
        style={{ 
          fontSize: 'clamp(32px, 8vw, 72px)',
          textAlign: 'center',
          margin: 0,
          padding: '20px 0'
        }}
      >
        AI Layanan Informasi
      </h1>
    </div>
  );
};

export default AnimatedText;
```

### 4. Import di index.html

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/gradient-text-stacked.css">
```

## 🎨 Efek Animasi

### 1. Gradient Bergerak
- Gradient berwarna bergerak dari kiri ke kanan
- Durasi: 4 detik
- Loop: Infinite
- Easing: ease-in-out

### 2. Stacked Layer Effect
- 2 layer bayangan di belakang teks utama
- Layer pertama: blur + pulsing animation
- Layer kedua: static dengan opacity rendah

### 3. Pulsing Shadow
- Bayangan bergerak dan membesar secara halus
- Durasi: 3 detik
- Alternate direction untuk efek breathing

## 🎨 Kustomisasi

### Mengubah Warna Gradient

Edit di `public/gradient-text-stacked.css`:

```css
background-image: linear-gradient(90deg, 
  #0af260,  /* Hijau terang */
  #00e0ff,  /* Cyan */
  #007bff,  /* Biru */
  #ffffff   /* Putih */
);
```

### Mengubah Teks

Edit di `components/AnimatedText.tsx`:

```tsx
<h1 
  className="gradient-text" 
  data-text="Teks Baru Anda"  // Ubah ini
>
  Teks Baru Anda  // Dan ini
</h1>
```

**Penting:** Atribut `data-text` harus sama dengan konten teks untuk efek stacked layer.

### Mengubah Ukuran Font

```tsx
style={{ 
  fontSize: 'clamp(32px, 8vw, 72px)',  // min, preferred, max
}}
```

### Mengubah Kecepatan Animasi

Di CSS:
```css
animation: moveGradient 4s ease-in-out infinite;  /* Ubah 4s */
animation: pulseShadow 3s ease-in-out infinite alternate;  /* Ubah 3s */
```

## 📱 Responsive Design

Animasi sudah fully responsive:

- **Desktop (>1024px):** Font size 72px
- **Tablet (768-1024px):** Font size ~8vw
- **Mobile (<768px):** Font size minimum 32px

Menggunakan `clamp()` untuk smooth scaling tanpa media queries.

## ⚡ Performance

### Keuntungan CSS Animation:
1. ✅ **Zero Dependencies** - Tidak perlu install package
2. ✅ **Hardware Accelerated** - Menggunakan GPU
3. ✅ **Lightweight** - File CSS <2KB
4. ✅ **Fast Loading** - Tidak ada external requests
5. ✅ **SEO Friendly** - Teks tetap readable oleh search engine

### Optimasi yang Diterapkan:
- Menggunakan `transform` dan `opacity` (GPU accelerated)
- Tidak ada JavaScript runtime overhead
- Font Poppins di-preload dari Google Fonts
- CSS file di-serve dari local (tidak ada CDN dependency)

## 🐛 Troubleshooting

### Animasi Tidak Muncul

**Solusi:**
1. Cek apakah CSS file ter-load di Network tab
2. Pastikan path CSS benar: `/gradient-text-stacked.css`
3. Clear browser cache
4. Restart dev server

### Font Tidak Sesuai

**Solusi:**
1. Cek koneksi internet (Google Fonts)
2. Pastikan font Poppins ter-load di Network tab
3. Fallback ke system font jika perlu

### Efek Stacked Tidak Terlihat

**Solusi:**
1. Pastikan atribut `data-text` sama dengan konten
2. Cek background color (harus gelap untuk terlihat)
3. Adjust opacity di CSS jika perlu

## 🎯 Best Practices

1. ✅ Gunakan `clamp()` untuk responsive typography
2. ✅ Set `data-text` attribute untuk pseudo-elements
3. ✅ Gunakan `transform` untuk animasi smooth
4. ✅ Hindari animasi `width`, `height`, `left`, `right`
5. ✅ Test di berbagai browser dan device

## 📚 Resources

- [CSS Gradient Generator](https://cssgradient.io/)
- [Clamp Calculator](https://clamp.font-size.app/)
- [Can I Use - background-clip](https://caniuse.com/background-clip-text)

## 📝 Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ IE11 (tidak support background-clip: text)

## 🔄 Migration dari Lottie

Jika sebelumnya menggunakan Lottie:

1. ✅ Hapus dependency `@lottielab/lottie-player`
2. ✅ Ganti komponen dengan versi CSS
3. ✅ Tidak perlu cleanup useEffect
4. ✅ Performa lebih baik
5. ✅ Bundle size lebih kecil
