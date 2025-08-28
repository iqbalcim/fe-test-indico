# User Management Frontend

Aplikasi frontend modern untuk manajemen user yang dibangun dengan React, Material-UI, dan React Query. Aplikasi ini menyediakan interface yang elegan dan responsif untuk operasi CRUD (Create, Read, Update, Delete) pada data user.

## 🚀 Fitur Utama

- **Tampilan User**: Menampilkan daftar user dalam tabel yang interaktif
- **Tambah User**: Form untuk menambahkan user baru
- **Edit User**: Modal dialog untuk mengedit informasi user
- **Hapus User**: Konfirmasi penghapusan user dengan dialog
- **Pencarian**: Fitur pencarian user berdasarkan nama
- **Pagination**: Navigasi halaman untuk mengelola data dalam jumlah besar
- **Loading States**: Indikator loading yang smooth untuk semua operasi
- **Error Handling**: Penanganan error yang user-friendly
- **Responsive Design**: Tampilan yang optimal di berbagai ukuran layar

## 🛠️ Teknologi yang Digunakan

- **React 19.1.1** - Library JavaScript untuk membangun user interface
- **Material-UI (MUI) 7.3.1** - Component library untuk design system yang konsisten
- **React Query (TanStack Query) 5.85.5** - State management untuk data fetching dan caching
- **Vite 7.1.2** - Build tool yang cepat untuk development dan production
- **ESLint** - Linting tool untuk menjaga kualitas kode

## 📋 Prasyarat

Pastikan Anda telah menginstall:
- Node.js (versi 16 atau lebih baru)
- npm atau yarn

## 🔧 Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan aplikasi dalam mode development:
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5173`

## 📜 Scripts yang Tersedia

- `npm run dev` - Menjalankan aplikasi dalam mode development
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview build production secara lokal
- `npm run lint` - Menjalankan ESLint untuk memeriksa kualitas kode

## 🏗️ Struktur Proyek

```
src/
├── components/
│   ├── AddUser.jsx      # Komponen untuk menambah user baru
│   ├── EditUser.jsx     # Modal dialog untuk edit user
│   └── UserTable.jsx    # Tabel utama untuk menampilkan daftar user
├── assets/              # Asset statis (gambar, icon, dll)
├── App.jsx              # Komponen utama aplikasi
├── App.css              # Styling untuk App component
├── main.jsx             # Entry point aplikasi
└── index.css            # Global styling
```

## 🎨 Design System

Aplikasi ini menggunakan custom theme Material-UI dengan:
- **Color Palette**: Gradient modern dengan warna primary indigo dan secondary pink
- **Typography**: Font family Poppins dengan berbagai weight dan size
- **Components**: Custom styling untuk Paper, Button, dan komponen lainnya
- **Glassmorphism Effect**: Efek blur dan transparansi untuk tampilan modern

## 🌐 API Integration

Aplikasi ini terintegrasi dengan [JSONPlaceholder API](https://jsonplaceholder.typicode.com) untuk:
- `GET /users` - Mengambil daftar user
- `POST /users` - Menambah user baru
- `PUT /users/:id` - Update informasi user
- `DELETE /users/:id` - Menghapus user

## 📱 Fitur UI/UX

### Komponen UserTable
- Tabel responsif dengan pagination
- Search functionality dengan debouncing
- Action buttons (Edit & Delete) untuk setiap user
- Loading skeleton saat fetch data
- Empty state ketika tidak ada data

### Komponen AddUser
- Form validation untuk input name dan email
- Success notification setelah berhasil menambah user
- Error handling dengan pesan yang jelas
- Auto-reset form setelah submit berhasil

### Komponen EditUser
- Modal dialog yang elegant
- Pre-filled form dengan data user yang akan diedit
- Konfirmasi perubahan sebelum save
- Loading state saat proses update

## 🔄 State Management

Menggunakan React Query untuk:
- **Caching**: Data user di-cache untuk performa yang lebih baik
- **Background Updates**: Auto-refresh data di background
- **Optimistic Updates**: UI update langsung sebelum API response
- **Error Retry**: Automatic retry untuk request yang gagal

## 🎯 Best Practices

- **Component Composition**: Komponen yang reusable dan modular
- **Error Boundaries**: Penanganan error yang graceful
- **Performance Optimization**: Lazy loading dan memoization
- **Accessibility**: ARIA labels dan keyboard navigation
- **Code Quality**: ESLint rules dan consistent formatting

## 🚀 Deployment

Untuk deploy ke production:

1. Build aplikasi:
```bash
npm run build
```

2. Deploy folder `dist` ke hosting provider pilihan Anda (Vercel, Netlify, dll)

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan MIT License.

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini.

---

**Happy Coding! 🎉**
