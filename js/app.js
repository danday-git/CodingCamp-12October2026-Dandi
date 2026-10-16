// =============================================================================
// PERSONAL DASHBOARD — app.js
// =============================================================================

// ====== THEME TOGGLE ======

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    console.warn('Failed to save theme:', e);
  }
  applyTheme(next);
}

// ====== CUSTOM NAME GREETING ======

var userName = '';

function loadUserName() {
  try {
    var stored = localStorage.getItem('userName');
    userName = stored ? stored : '';
  } catch (e) {
    console.warn('Failed to load userName:', e);
    userName = '';
  }
}

function saveUserName(name) {
  try {
    localStorage.setItem('userName', name);
  } catch (e) {
    console.warn('Failed to save userName:', e);
  }
}

function getGreetingText(hour, name) {
  var timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 'Good Morning';
  else if (hour >= 12 && hour < 18) timeOfDay = 'Good Afternoon';
  else timeOfDay = 'Good Evening';

  var emoji = (hour >= 12 && hour < 18) ? '☀️' : '👋';
  if (hour < 5 || hour >= 18) emoji = '🌙';
  // Use 👋 for morning, ☀️ for afternoon, 🌙 for evening (matching original)
  if (hour >= 5 && hour < 12) emoji = '👋';
  else if (hour >= 12 && hour < 18) emoji = '☀️';
  else emoji = '🌙';

  if (name) {
    return timeOfDay + ', ' + name + ' ' + emoji;
  }
  return timeOfDay + ' ' + emoji;
}

// ========================== CLOCK & GREETING ==========================

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  var s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m + ':' + s;

  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dateStr = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
  document.getElementById('date').textContent = dateStr;

  var hour = now.getHours();
  document.getElementById('greeting').textContent = getGreetingText(hour, userName);
}

// ========================== FOCUS TIMER ==========================

var timerState = {
  seconds: 1500,
  interval: null,
  running: false
};

function renderTimer() {
  var mm = String(Math.floor(timerState.seconds / 60)).padStart(2, '0');
  var ss = String(timerState.seconds % 60).padStart(2, '0');
  var display = document.getElementById('timer-display');
  display.textContent = mm + ':' + ss;
  document.getElementById('btn-start').disabled = timerState.running;
  document.getElementById('btn-stop').disabled = !timerState.running;
}

function startTimer() {
  if (timerState.running) return;
  timerState.running = true;
  var display = document.getElementById('timer-display');
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
  var display = document.getElementById('timer-display');
  display.classList.remove('running');
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timerState.seconds = 1500;
  var display = document.getElementById('timer-display');
  display.classList.remove('ended', 'running');
  renderTimer();
}

function onTimerEnd() {
  var display = document.getElementById('timer-display');
  display.classList.remove('running');
  display.classList.add('ended');
  // Optional audio cue using Web Audio API
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
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

var tasks = [];

function loadTasks() {
  try {
    var stored = localStorage.getItem('tasks');
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

// ====== SORT TASKS ======

var currentSort = 'default';

function loadSortPreference() {
  try {
    var stored = localStorage.getItem('taskSort');
    currentSort = stored ? stored : 'default';
  } catch (e) {
    console.warn('Failed to load sort preference:', e);
    currentSort = 'default';
  }
  var el = document.getElementById('sort-select');
  if (el) el.value = currentSort;
}

function saveSortPreference(sort) {
  try {
    localStorage.setItem('taskSort', sort);
  } catch (e) {
    console.warn('Failed to save sort preference:', e);
  }
}

function renderTasks() {
  var list = document.getElementById('todo-list');
  list.innerHTML = '';

  // Create a sorted copy — do NOT mutate the original array
  var sorted = tasks.slice();
  if (currentSort === 'active') {
    sorted.sort(function(a, b) { return (a.done ? 1 : 0) - (b.done ? 1 : 0); });
  } else if (currentSort === 'done') {
    sorted.sort(function(a, b) { return (b.done ? 1 : 0) - (a.done ? 1 : 0); });
  } else if (currentSort === 'az') {
    sorted.sort(function(a, b) {
      return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
    });
  }
  // 'default': original insertion order — no sort needed

  sorted.forEach(function(task) {
    var li = document.createElement('li');
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
  var trimmed = text.trim();
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
  var task = tasks.find(function(t) { return t.id === id; });
  if (!task) return;
  var newText = window.prompt('Edit task:', task.text);
  if (newText === null) return; // cancelled
  var trimmed = newText.trim();
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

var DEFAULT_LINKS = [
  { id: 1, name: 'Google',       url: 'https://google.com' },
  { id: 2, name: 'GitHub',       url: 'https://github.com' },
  { id: 3, name: 'YouTube',      url: 'https://youtube.com' },
  { id: 4, name: 'ChatGPT',      url: 'https://chatgpt.com' },
  { id: 5, name: 'MDN Web Docs', url: 'https://developer.mozilla.org' }
];

var links = [];

function loadLinks() {
  try {
    var stored = localStorage.getItem('quickLinks');
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
  var grid = document.getElementById('links-grid');
  grid.innerHTML = '';
  links.forEach(function(link) {
    var card = document.createElement('div');
    card.className = 'link-card';
    card.innerHTML =
      '<a href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(link.name) + '</a>' +
      '<button class="btn-delete-link" data-id="' + link.id + '">Delete</button>';
    grid.appendChild(card);
  });
}

function addLink(name, url) {
  var trimmedName = name.trim();
  var trimmedUrl = url.trim();
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
  // Theme
  var savedTheme;
  try {
    savedTheme = localStorage.getItem('theme') || 'dark';
  } catch (e) {
    savedTheme = 'dark';
  }
  applyTheme(savedTheme);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Custom name
  loadUserName();

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  document.getElementById('btn-edit-name').addEventListener('click', function() {
    var n = window.prompt("What's your name?", userName);
    if (n !== null && n.trim() !== '') {
      userName = n.trim();
      saveUserName(userName);
      updateClock();
    }
  });

  // Timer
  renderTimer();
  document.getElementById('btn-start').addEventListener('click', startTimer);
  document.getElementById('btn-stop').addEventListener('click', stopTimer);
  document.getElementById('btn-reset').addEventListener('click', resetTimer);

  // To-Do
  loadTasks();
  loadSortPreference();
  renderTasks();

  document.getElementById('btn-add-task').addEventListener('click', function() {
    var input = document.getElementById('todo-input');
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

  document.getElementById('sort-select').addEventListener('change', function() {
    currentSort = this.value;
    saveSortPreference(currentSort);
    renderTasks();
  });

  // Event delegation for todo list
  document.getElementById('todo-list').addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var id = Number(btn.dataset.id);
    if (btn.classList.contains('btn-done'))   toggleTask(id);
    if (btn.classList.contains('btn-edit'))   editTask(id);
    if (btn.classList.contains('btn-delete')) deleteTask(id);
  });

  // Quick Links
  loadLinks();
  renderLinks();

  document.getElementById('btn-add-link').addEventListener('click', function() {
    var nameInput = document.getElementById('link-name-input');
    var urlInput  = document.getElementById('link-url-input');
    var added = addLink(nameInput.value, urlInput.value);
    if (added) {
      nameInput.value = '';
      urlInput.value  = '';
      nameInput.focus();
    }
  });

  // Event delegation for links grid
  document.getElementById('links-grid').addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var id = Number(btn.dataset.id);
    if (btn.classList.contains('btn-delete-link')) deleteLink(id);
  });
}

init();
