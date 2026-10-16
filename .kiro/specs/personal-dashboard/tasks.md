# Tasks — Personal Dashboard

Urutan implementasi dari yang paling fundamental ke fitur.

---

## Task 1: Setup Struktur Proyek

- [ ] Buat `index.html` dengan boilerplate HTML5
- [ ] Tambahkan link ke `css/style.css` dan `js/app.js` di `index.html`
- [ ] Import Google Fonts (Poppins) via `@import` di `style.css`
- [ ] Buat struktur folder `css/` dan `js/` (sudah ada)
- [ ] Verifikasi: buka `index.html` di browser, tidak ada error di console

---

## Task 2: Greeting & Clock

- [ ] Buat section HTML `#greeting-section` dengan elemen `#clock`, `#date`, `#greeting`
- [ ] Tulis fungsi `updateClock()` di `app.js`:
  - Format jam → `HH:MM:SS`
  - Format tanggal → `Weekday, Month DD, YYYY`
  - Logic greeting berdasarkan jam
- [ ] Panggil `updateClock()` sekali saat init dan set `setInterval` setiap 1000ms
- [ ] Verifikasi: jam berjalan real-time, greeting berubah sesuai waktu

---

## Task 3: Focus Timer

- [ ] Buat section HTML `#timer-section` dengan `#timer-display` dan 3 tombol
- [ ] Tulis state timer: `{ seconds: 1500, interval: null, running: false }`
- [ ] Tulis fungsi `renderTimer()` — update display dan disabled state tombol
- [ ] Tulis fungsi `startTimer()`, `stopTimer()`, `resetTimer()`
- [ ] Tulis fungsi `onTimerEnd()` — notifikasi visual (class `.ended`) dan opsional audio
- [ ] Pasang event listener ke 3 tombol
- [ ] Verifikasi: countdown berjalan, stop menjeda, reset kembali ke 25:00, notifikasi muncul di 00:00

---

## Task 4: To-Do List — Tampilan & Add

- [ ] Buat section HTML `#todo-section` dengan `#todo-input`, `#btn-add-task`, `#todo-list`
- [ ] Tulis `loadTasks()` — baca dari `localStorage["tasks"]`, fallback ke `[]`
- [ ] Tulis `saveTasks()` — tulis array tasks ke localStorage
- [ ] Tulis `renderTasks()` — render `<li>` untuk setiap task dengan tombol Done, Edit, Delete
- [ ] Tulis `addTask(text)` — validasi tidak kosong, buat object task, save, render
- [ ] Pasang event listener: klik tombol Add dan tekan Enter di input
- [ ] Verifikasi: task muncul di list, tersimpan setelah refresh halaman

---

## Task 5: To-Do List — Edit, Done, Delete

- [ ] Tulis `toggleTask(id)` — toggle `done`, save, render
- [ ] Tulis `deleteTask(id)` — hapus dari array, save, render
- [ ] Tulis `editTask(id)` — tampilkan prompt/inline edit, update teks, save, render
- [ ] Gunakan event delegation pada `#todo-list` untuk menangani klik tombol
- [ ] Style task `.done`: strikethrough + warna redup
- [ ] Verifikasi: semua operasi CRUD berfungsi, perubahan persisten di localStorage

---

## Task 6: Quick Links — Tampilan & Add

- [ ] Buat section HTML `#links-section` dengan `#links-grid` dan form add link
- [ ] Definisikan `DEFAULT_LINKS` (5 link: Google, GitHub, YouTube, ChatGPT, MDN)
- [ ] Tulis `loadLinks()` — baca dari `localStorage["quickLinks"]`, fallback ke DEFAULT_LINKS lalu save
- [ ] Tulis `saveLinks()` — tulis array links ke localStorage
- [ ] Tulis `renderLinks()` — render kartu link dengan nama + tombol Delete, href buka tab baru
- [ ] Tulis `addLink(name, url)` — validasi, auto-prefix `https://` jika perlu, save, render
- [ ] Pasang event listener ke form add link
- [ ] Verifikasi: link default muncul saat pertama kali buka, link baru tersimpan setelah refresh

---

## Task 7: Quick Links — Delete

- [ ] Tulis `deleteLink(id)` — hapus dari array, save, render
- [ ] Gunakan event delegation pada `#links-grid`
- [ ] Verifikasi: hapus link berfungsi dan persisten

---

## Task 8: Styling & Polish

- [ ] Definisikan CSS custom properties (variabel warna, spacing, radius) di `:root`
- [ ] Style semua section: background card, border-radius, padding, margin
- [ ] Style clock, greeting, date
- [ ] Style timer display: font besar monospace, warna berubah saat running/ended
- [ ] Style tombol-tombol: primary, danger, secondary states + hover
- [ ] Style to-do list: item layout, done state, edit mode
- [ ] Style quick links grid: `grid`, kartu hover effect
- [ ] Style form inputs
- [ ] Tambahkan CSS animasi pulse untuk timer ended
- [ ] Verifikasi: tampilan rapi di browser, tidak ada elemen yang overflow atau misaligned

---

## Task 9: Final Review & Cleanup

- [ ] Periksa semua operasi localStorage dibungkus try/catch atau null-check
- [ ] Periksa tidak ada `console.error` saat halaman pertama dibuka
- [ ] Pastikan semua ID di HTML cocok dengan selector di JS dan CSS
- [ ] Hapus semua `console.log` debug yang tidak diperlukan
- [ ] Tambahkan komentar singkat di setiap section kode JS
- [ ] Verifikasi final: buka `index.html` dari file, coba semua fitur satu per satu
