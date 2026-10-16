# Requirements — Personal Dashboard

## Overview

Aplikasi web personal dashboard yang berjalan sepenuhnya di browser (client-side only). Pengguna dapat melihat waktu dan greeting, menggunakan focus timer, mengelola to-do list, dan mengakses quick links favorit. Semua data disimpan di LocalStorage browser.

---

## Functional Requirements

### FR-1: Greeting & Clock

- **FR-1.1** Aplikasi menampilkan jam digital yang update setiap detik dalam format `HH:MM:SS`.
- **FR-1.2** Aplikasi menampilkan tanggal hari ini dalam format yang mudah dibaca, contoh: `Friday, October 16, 2026`.
- **FR-1.3** Aplikasi menampilkan greeting berdasarkan waktu:
  - `Good Morning` → pukul 05:00–11:59
  - `Good Afternoon` → pukul 12:00–17:59
  - `Good Evening` → pukul 18:00–04:59

---

### FR-2: Focus Timer (Pomodoro)

- **FR-2.1** Timer dimulai dari 25 menit (1500 detik) dan hitung mundur ke 00:00.
- **FR-2.2** Timer ditampilkan dalam format `MM:SS`.
- **FR-2.3** Tersedia tiga tombol:
  - **Start** — memulai atau melanjutkan timer.
  - **Stop** — menjeda timer tanpa mereset.
  - **Reset** — mengembalikan timer ke 25:00 dan menghentikan hitungan.
- **FR-2.4** Saat timer mencapai 00:00, tampilkan notifikasi visual (misal: warna berubah atau pesan muncul) dan/atau audio cue (opsional, gunakan Web Audio API).
- **FR-2.5** Tombol Start berubah menjadi tidak aktif (disabled) saat timer sedang berjalan, dan sebaliknya untuk Stop.

---

### FR-3: To-Do List

- **FR-3.1** Pengguna dapat menambahkan task baru melalui input field + tombol Add (atau tekan Enter).
- **FR-3.2** Setiap task ditampilkan dengan:
  - Teks task
  - Tombol/checkbox untuk menandai selesai (done)
  - Tombol Edit untuk mengubah teks task
  - Tombol Delete untuk menghapus task
- **FR-3.3** Task yang sudah selesai ditampilkan secara visual berbeda (strikethrough dan warna redup).
- **FR-3.4** Semua task disimpan ke LocalStorage dengan key `"tasks"` dan dimuat ulang saat halaman dibuka.
- **FR-3.5** Input field dikosongkan setelah task berhasil ditambahkan.
- **FR-3.6** Task kosong (hanya spasi) tidak boleh ditambahkan.

---

### FR-4: Quick Links

- **FR-4.1** Pengguna dapat menyimpan link favorit berupa nama + URL.
- **FR-4.2** Setiap link ditampilkan sebagai tombol/kartu yang dapat diklik dan membuka URL di tab baru.
- **FR-4.3** Setiap link memiliki tombol Delete untuk menghapusnya.
- **FR-4.4** Tersedia form "Add Link" dengan dua field: **Name** dan **URL**.
- **FR-4.5** Semua link disimpan ke LocalStorage dengan key `"quickLinks"`.
- **FR-4.6** Pada load pertama (LocalStorage kosong), pre-populate dengan link default:
  - Google → https://google.com
  - GitHub → https://github.com
  - YouTube → https://youtube.com
  - ChatGPT → https://chatgpt.com
  - MDN Web Docs → https://developer.mozilla.org

---

## Non-Functional Requirements

### NFR-1: Technology Stack

- **NFR-1.1** HTML5 untuk struktur.
- **NFR-1.2** CSS3 untuk styling — hanya 1 file di `css/style.css`.
- **NFR-1.3** Vanilla JavaScript — hanya 1 file di `js/app.js`. Tidak boleh menggunakan framework (React, Vue, dll.).
- **NFR-1.4** Tidak ada backend server. Tidak ada build tools. Tidak ada dependency eksternal kecuali Google Fonts via `@import`.

### NFR-2: Data Storage

- **NFR-2.1** Semua data disimpan di `localStorage` browser.
- **NFR-2.2** Semua operasi baca/tulis localStorage harus aman (null-check atau try/catch).

### NFR-3: Struktur File

```
project-root/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

### NFR-4: Visual Design

- **NFR-4.1** Tampilan bersih, minimal, dan modern.
- **NFR-4.2** Hierarki visual yang jelas antar section.
- **NFR-4.3** Tipografi yang mudah dibaca (gunakan Google Font: Inter atau Poppins).
- **NFR-4.4** Responsif untuk layar desktop dan laptop.

### NFR-5: Performance & Compatibility

- **NFR-5.1** Load time cepat, tidak ada lag saat interaksi UI.
- **NFR-5.2** Berjalan di browser modern: Chrome, Firefox, Edge, Safari.
- **NFR-5.3** Dapat dibuka langsung sebagai file `index.html` (tanpa server) maupun di-deploy ke GitHub Pages.
