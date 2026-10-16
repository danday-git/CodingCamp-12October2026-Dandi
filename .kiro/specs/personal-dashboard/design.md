# Design — Personal Dashboard

## 1. Arsitektur Umum

Aplikasi ini adalah **Single Page Application (SPA) statis** tanpa server. Semua logika berjalan di browser.

```
index.html  ←→  js/app.js  ←→  localStorage
     ↑
css/style.css
```

- `index.html` mendefinisikan seluruh struktur DOM.
- `app.js` menangani semua event handling, logika timer, CRUD task & link, dan sinkronisasi dengan localStorage.
- `style.css` menangani semua visual, termasuk CSS custom properties (variables) untuk theming.

---

## 2. Struktur HTML (`index.html`)

```html
<body>
  <div class="container">

    <!-- Section 1: Greeting & Clock -->
    <section id="greeting-section">
      <div id="clock">00:00:00</div>
      <div id="date">Friday, October 16, 2026</div>
      <h1 id="greeting">Good Morning 👋</h1>
    </section>

    <!-- Section 2: Focus Timer -->
    <section id="timer-section">
      <h2>Focus Timer</h2>
      <div id="timer-display">25:00</div>
      <div class="timer-controls">
        <button id="btn-start">Start</button>
        <button id="btn-stop" disabled>Stop</button>
        <button id="btn-reset">Reset</button>
      </div>
    </section>

    <!-- Section 3: To-Do List -->
    <section id="todo-section">
      <h2>To-Do List</h2>
      <div class="todo-input-row">
        <input id="todo-input" type="text" placeholder="Add a new task..." />
        <button id="btn-add-task">Add</button>
      </div>
      <ul id="todo-list">
        <!-- task items rendered by JS -->
      </ul>
    </section>

    <!-- Section 4: Quick Links -->
    <section id="links-section">
      <h2>Quick Links</h2>
      <div id="links-grid">
        <!-- link cards rendered by JS -->
      </div>
      <div class="add-link-form">
        <input id="link-name-input" type="text" placeholder="Name" />
        <input id="link-url-input" type="url" placeholder="https://..." />
        <button id="btn-add-link">Add Link</button>
      </div>
    </section>

  </div>
</body>
```

---

## 3. Struktur JavaScript (`js/app.js`)

Kode dibagi ke dalam modul fungsional yang jelas:

```
app.js
├── == CLOCK & GREETING ==
│   ├── updateClock()         → update #clock, #date, #greeting setiap detik
│   └── setInterval(updateClock, 1000)
│
├── == FOCUS TIMER ==
│   ├── timerState            → { seconds: 1500, interval: null, running: false }
│   ├── renderTimer()         → update #timer-display, toggle btn disabled state
│   ├── startTimer()          → mulai interval countdown
│   ├── stopTimer()           → pause interval
│   ├── resetTimer()          → reset ke 1500, stop interval
│   └── onTimerEnd()          → notifikasi visual/audio
│
├── == TO-DO LIST ==
│   ├── tasks[]               → array of { id, text, done }
│   ├── loadTasks()           → baca dari localStorage "tasks"
│   ├── saveTasks()           → tulis ke localStorage "tasks"
│   ├── renderTasks()         → render ulang #todo-list
│   ├── addTask(text)         → push task baru, save, render
│   ├── toggleTask(id)        → toggle done, save, render
│   ├── editTask(id)          → prompt / inline edit, save, render
│   └── deleteTask(id)        → filter array, save, render
│
├── == QUICK LINKS ==
│   ├── links[]               → array of { id, name, url }
│   ├── DEFAULT_LINKS         → array 5 link default
│   ├── loadLinks()           → baca dari localStorage "quickLinks"
│   ├── saveLinks()           → tulis ke localStorage "quickLinks"
│   ├── renderLinks()         → render ulang #links-grid
│   ├── addLink(name, url)    → push link baru, save, render
│   └── deleteLink(id)        → filter array, save, render
│
└── == INIT ==
    └── init()                → panggil semua load + render + startClock
```

### ID Generation
Gunakan `Date.now()` sebagai ID unik untuk task dan link. Cukup untuk skala aplikasi ini.

### Event Delegation
Untuk to-do list dan quick links, gunakan **event delegation** pada parent element (`#todo-list`, `#links-grid`) daripada menambahkan listener ke setiap item. Ini lebih efisien dan aman saat DOM di-render ulang.

---

## 4. Desain Visual

### Color Palette (Dark Theme)
```css
--bg-primary:    #0f0f13;   /* background utama */
--bg-section:    #1a1a24;   /* background card/section */
--bg-hover:      #252535;   /* hover state */
--accent:        #6c63ff;   /* warna utama (ungu) */
--accent-hover:  #5a52e0;
--text-primary:  #f0f0f5;
--text-secondary:#9090aa;
--text-done:     #555566;   /* task selesai */
--danger:        #e05555;   /* tombol delete */
--success:       #55cc88;   /* timer selesai */
--border:        #2a2a3a;
```

### Typography
- Font: `Poppins` dari Google Fonts (weights: 400, 500, 600)
- Clock: `font-size: 3rem`, `font-weight: 600`
- Greeting: `font-size: 1.8rem`
- Timer display: `font-size: 4rem`, `font-weight: 600`, `font-family: monospace`

### Layout
- `.container`: `max-width: 800px`, `margin: 0 auto`, `padding: 2rem`
- Setiap section: `background: var(--bg-section)`, `border-radius: 12px`, `padding: 1.5rem`, `margin-bottom: 1.5rem`
- Quick links grid: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))`

### States
- Timer running: `#timer-display` punya class `.running` → warna accent
- Timer ended: `#timer-display` punya class `.ended` → warna success + animasi pulse
- Task done: `<li>` punya class `.done` → text-decoration strikethrough, warna redup

---

## 5. LocalStorage Schema

### Key: `"tasks"`
```json
[
  { "id": 1728123456789, "text": "Belajar CSS Grid", "done": false },
  { "id": 1728123456790, "text": "Push ke GitHub", "done": true }
]
```

### Key: `"quickLinks"`
```json
[
  { "id": 1728123456791, "name": "Google", "url": "https://google.com" },
  { "id": 1728123456792, "name": "GitHub", "url": "https://github.com" }
]
```

---

## 6. Edge Cases & Validasi

| Kasus | Penanganan |
|---|---|
| Task input kosong / hanya spasi | Tidak diproses, fokus kembali ke input |
| URL link tidak diawali `http` | Tambahkan `https://` otomatis sebelum simpan |
| localStorage penuh / error | Wrap dengan try/catch, tampilkan console.warn |
| Timer sudah di 00:00 lalu Reset | Reset berjalan normal |
| Edit task — input kosong | Batalkan edit, kembalikan teks semula |
