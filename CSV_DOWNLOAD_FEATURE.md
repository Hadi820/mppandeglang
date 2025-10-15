# Fitur Download CSV - Analytics Dashboard

## 🎯 Deskripsi

Fitur download CSV memungkinkan admin untuk mengekspor data analytics dalam format CSV yang dapat dibuka di Excel, Google Sheets, atau aplikasi spreadsheet lainnya.

## ✨ Fitur Utama

### 1. **Tombol Download dengan Dropdown Menu**
- Tombol hijau dengan icon download di sebelah judul "Analitik Pengguna"
- Hover pada tombol untuk menampilkan menu pilihan
- Tombol otomatis disabled jika tidak ada data

### 2. **3 Jenis Export CSV**

#### 📊 **Semua Data**
File: `analytics_all_[periode]_[tanggal].csv`

Berisi:
- Tanggal & Waktu
- Pertanyaan lengkap
- Layanan yang dicari
- Waktu respons (ms)
- Status (Berhasil/Gagal)

**Kegunaan**: Analisis detail semua interaksi pengguna

#### 📈 **Ringkasan Statistik**
File: `analytics_summary_[periode]_[tanggal].csv`

Berisi:
- Metrik utama (Total Sesi, Pengguna Unik, dll)
- Perubahan dibanding periode sebelumnya
- Top layanan yang dicari dengan persentase
- Top kata kunci dengan tren

**Kegunaan**: Laporan eksekutif dan presentasi

#### ⚠️ **Pertanyaan Gagal**
File: `analytics_failed_[periode]_[tanggal].csv`

Berisi:
- Tanggal & Waktu
- Pertanyaan yang gagal dijawab
- Layanan yang dicari
- Waktu respons (ms)

**Kegunaan**: Identifikasi area yang perlu perbaikan

## 🔧 Fitur Teknis

### Format CSV
- **Encoding**: UTF-8 dengan BOM (untuk kompatibilitas Excel)
- **Delimiter**: Koma (,)
- **Quote**: Tanda kutip ganda (") untuk field yang mengandung koma atau newline
- **Escape**: Double quote ("") untuk escape tanda kutip dalam teks

### Nama File
Format: `analytics_[tipe]_[periode]_[tanggal].csv`

Contoh:
- `analytics_all_7d_2025-10-15.csv`
- `analytics_summary_30d_2025-10-15.csv`
- `analytics_failed_custom_2025-10-15.csv`

### Periode dalam Nama File
- `7d` - 7 Hari terakhir
- `30d` - 30 Hari terakhir
- `mtd` - Month to Date (Bulan ini)
- `yearly` - Tahunan
- `2025-01-01_2025-01-31` - Custom range

## 📱 Responsive Design

- **Desktop**: Tombol dengan teks "Download CSV"
- **Mobile**: Tombol dengan teks "CSV" (lebih ringkas)
- Dropdown menu menyesuaikan posisi agar tidak keluar layar

## 🎨 UI/UX

### Tombol
- Warna: Gradient hijau (green-500 to green-600)
- Hover: Gradient lebih gelap (green-600 to green-700)
- Icon: Arrow down tray (download icon)
- Shadow: Medium shadow dengan hover effect

### Dropdown Menu
- Muncul saat hover pada tombol
- Background: Putih dengan shadow
- Border: Gray-200
- Hover item: Blue-50 background
- Emoji icon untuk setiap pilihan

## 💡 Tips Penggunaan

1. **Untuk Laporan Bulanan**: Gunakan "Ringkasan Statistik" dengan periode "Bulan Ini"
2. **Untuk Analisis Detail**: Gunakan "Semua Data" dengan custom date range
3. **Untuk Improvement**: Gunakan "Pertanyaan Gagal" untuk identifikasi gap dalam knowledge base

## 🔒 Keamanan

- Fitur hanya tersedia untuk admin yang sudah login
- Data yang diexport sesuai dengan periode yang dipilih
- Tidak ada data sensitif pengguna (PII) dalam export

## 🚀 Cara Menggunakan

1. Login sebagai admin
2. Buka tab "Analitik"
3. Pilih periode waktu yang diinginkan (7d, 30d, MTD, Yearly, atau Custom)
4. Hover pada tombol "Download CSV"
5. Pilih jenis data yang ingin didownload:
   - 📊 Semua Data
   - 📈 Ringkasan Statistik
   - ⚠️ Pertanyaan Gagal
6. File CSV akan otomatis terdownload

## 📊 Contoh Output

### Semua Data
```csv
Tanggal & Waktu,Pertanyaan,Layanan Dicari,Waktu Respons (ms),Status
15/10/2025 10:30:45,"Syarat buat KTP",KTP,1250,Berhasil
15/10/2025 10:35:20,"Biaya perpanjang SIM",SIM,980,Berhasil
```

### Ringkasan Statistik
```csv
Metrik,Nilai,Perubahan
Total Sesi Chat,150,+15.5% Increase
Pengguna Unik (Estimasi),45,+8.2% Increase
```

### Pertanyaan Gagal
```csv
Tanggal & Waktu,Pertanyaan,Layanan Dicari,Waktu Respons (ms)
15/10/2025 11:20:30,"Cara daftar beasiswa",Error,1500
```

## 🔄 Update Future

Fitur yang bisa ditambahkan:
- Export ke format Excel (.xlsx)
- Export ke PDF
- Schedule automatic export (email report)
- Export dengan filter tambahan
- Export chart sebagai image
