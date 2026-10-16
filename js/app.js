// =============================================================================
// PERSONAL DASHBOARD — app.js
// =============================================================================

// ========================== CLOCK & GREETING ==========================

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m + ':' + s;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateStr = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
  document.getElementById('date').textContent = dateStr;

  const hour = now.getHours();
  let greeting;
  if (hour >= 5 && hour < 12) greeting = 'Good Morning 👋';
  else if (hour >= 12 && hour < 18) greeting = 'Good Afternoon ☀️';
  else greeting = 'Good Evening 🌙';
  document.getElementById('greeting').textContent = greeting;
}

// ========================== FOCUS TIMER ==========================

const timerState = {
  seconds: 1500,
  interval: null,
  running: false
};

function renderTimer() {
  const mm = String(Math.floor(timerState.seconds / 60)).padStart(2, '0');
  const ss = String(timerState.seconds % 60).padStart(2, '0');
  const display = document.getElementById('timer-display');
  display.textContent = mm + ':' + ss;
  document.getElementById('btn-start').disabled = timerState.running;
  document.getElementById('btn-stop').disabled = !timerState.running;
}

function startTimer() {
  if (timerState.running) return;
  timerState.running = true;
  const display = document.getElementById('timer-display');
  display.classList.add('running');
  display.classList.remove('ended');
  timerState.interval = setInterval(function() {
    timerState.seconds--;
    renderTimer();
    if (timerState.seconds <= 0) {
      stopTimer();
      onTimerEnd();
    }
  }, 1000);
  renderTimer();
}

function stopTimer() {
  timerState.running = false;
  clearInterval(timerState.interval);
  timerState.interval = null;
  const display = document.getElementById('timer-display');
  display.classList.remove('running');
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timerState.seconds = 1500;
  const display = document.getElementById('timer-display');
  display.classList.remove('ended', 'running');
  renderTimer();
}

function onTimerEnd() {
  const display = document.getElementById('timer-display');
  display.classList.remove('running');
  display.classList.add('ended');
  // Optional audio cue using Web Audio API
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {
    // Audio not supported — fail silently
  }
}

// ========================== TO-DO LIST ==========================

let tasks = [];

function loadTasks() {
  try {
    const stored = localStorage.getItem('tasks');
    tasks = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('Failed to load tasks:', e);
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks:', e);
  }
}

function renderTasks() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  tasks.forEach(function(task) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');
    li.innerHTML =
      '<span class="task-text">' + escapeHtml(task.text) + '</span>' +
      '<button class="btn-done" data-id="' + task.id + '">' + (task.done ? 'Undo' : 'Done') + '</button>' +
      '<button class="btn-edit" data-id="' + task.id + '">Edit</button>' +
      '<button class="btn-delete" data-id="' + task.id + '">Delete</button>';
    list.appendChild(li);
  });
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.push({ id: Date.now(), text: trimmed, done: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function(t) {
    return t.id === id ? Object.assign({}, t, { done: !t.done }) : t;
  });
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(function(t) { return t.id === id; });
  if (!task) return;
  const newText = window.prompt('Edit task:', task.text);
  if (newText === null) return; // cancelled
  const trimmed = newText.trim();
  if (!trimmed) return; // empty — discard
  tasks = tasks.map(function(t) {
    return t.id === id ? Object.assign({}, t, { text: trimmed }) : t;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

// ========================== QUICK LINKS ==========================

const DEFAULT_LINKS = [
  { id: 1, name: 'Google',       url: 'https://google.com' },
  { id: 2, name: 'GitHub',       url: 'https://github.com' },
  { id: 3, name: 'YouTube',      url: 'https://youtube.com' },
  { id: 4, name: 'ChatGPT',      url: 'https://chatgpt.com' },
  { id: 5, name: 'MDN Web Docs', url: 'https://developer.mozilla.org' }
];

let links = [];

function loadLinks() {
  try {
    const stored = localStorage.getItem('quickLinks');
    if (stored) {
      links = JSON.parse(stored);
    } else {
      links = DEFAULT_LINKS.slice();
      saveLinks();
    }
  } catch (e) {
    console.warn('Failed to load links:', e);
    links = DEFAULT_LINKS.slice();
  }
}

function saveLinks() {
  try {
    localStorage.setItem('quickLinks', JSON.stringify(links));
  } catch (e) {
    console.warn('Failed to save links:', e);
  }
}

function renderLinks() {
  const grid = document.getElementById('links-grid');
  grid.innerHTML = '';
  links.forEach(function(link) {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.innerHTML =
      '<a href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(link.name) + '</a>' +
      '<button class="btn-delete-link" data-id="' + link.id + '">Delete</button>';
    grid.appendChild(card);
  });
}

function addLink(name, url) {
  const trimmedName = name.trim();
  let trimmedUrl = url.trim();
  if (!trimmedName || !trimmedUrl) return false;
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    trimmedUrl = 'https://' + trimmedUrl;
  }
  links.push({ id: Date.now(), name: trimmedName, url: trimmedUrl });
  saveLinks();
  renderLinks();
  return true;
}

function deleteLink(id) {
  links = links.filter(function(l) { return l.id !== id; });
  saveLinks();
  renderLinks();
}

// ========================== UTILITIES ==========================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ========================== INIT ==========================

function init() {
  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Timer
  renderTimer();
  document.getElementById('btn-start').addEventListener('click', startTimer);
  document.getElementById('btn-stop').addEventListener('click', stopTimer);
  document.getElementById('btn-reset').addEventListener('click', resetTimer);

  // To-Do
  loadTasks();
  renderTasks();

  document.getElementById('btn-add-task').addEventListener('click', function() {
    const input = document.getElementById('todo-input');
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  document.getElementById('todo-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addTask(this.value);
      this.value = '';
    }
  });

  // Event delegation for todo list
  document.getElementById('todo-list').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.classList.contains('btn-done'))   toggleTask(id);
    if (btn.classList.contains('btn-edit'))   editTask(id);
    if (btn.classList.contains('btn-delete')) deleteTask(id);
  });

  // Quick Links
  loadLinks();
  renderLinks();

  document.getElementById('btn-add-link').addEventListener('click', function() {
    const nameInput = document.getElementById('link-name-input');
    const urlInput  = document.getElementById('link-url-input');
    const added = addLink(nameInput.value, urlInput.value);
    if (added) {
      nameInput.value = '';
      urlInput.value  = '';
      nameInput.focus();
    }
  });

  // Event delegation for links grid
  document.getElementById('links-grid').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.classList.contains('btn-delete-link')) deleteLink(id);
  });
}

init();
