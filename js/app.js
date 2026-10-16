// =============================================================================
// PERSONAL DASHBOARD — app.js
// =============================================================================

// ====== THEME TOGGLE ======

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === 'dark' ? '#0f0f13' : '#f5f5f0';
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
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

function updateNameButton() {
  var button = document.getElementById('btn-edit-name');
  if (!button) return;
  var label = userName ? 'Change greeting name' : 'Add name to greeting';
  var description = userName
    ? 'Change the name shown in your greeting above.'
    : 'Add a name to personalize your greeting above.';
  button.textContent = label;
  button.title = description;
  button.setAttribute('aria-label', label + '. ' + description);
}

function getGreetingText(hour, name) {
  var timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 'Good Morning';
  else if (hour >= 12 && hour < 18) timeOfDay = 'Good Afternoon';
  else timeOfDay = 'Good Evening';

  var emoji;
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
  var seconds = Math.max(0, timerState.seconds);
  var mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  var ss = String(seconds % 60).padStart(2, '0');
  var display = document.getElementById('timer-display');
  display.textContent = mm + ':' + ss;
  document.getElementById('btn-start').disabled = timerState.running || seconds === 0;
  document.getElementById('btn-stop').disabled = !timerState.running;
}

function startTimer() {
  if (timerState.running || timerState.seconds <= 0) return;
  timerState.running = true;
  var display = document.getElementById('timer-display');
  display.classList.add('running');
  display.classList.remove('ended');
  document.getElementById('timer-status').textContent = 'Timer running.';
  timerState.interval = setInterval(function() {
    timerState.seconds = Math.max(0, timerState.seconds - 1);
    renderTimer();
    if (timerState.seconds === 0) {
      stopTimer();
      onTimerEnd();
    }
  }, 1000);
  renderTimer();
}

function stopTimer() {
  var wasRunning = timerState.running;
  timerState.running = false;
  clearInterval(timerState.interval);
  timerState.interval = null;
  var display = document.getElementById('timer-display');
  display.classList.remove('running');
  if (wasRunning) document.getElementById('timer-status').textContent = 'Timer paused.';
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timerState.seconds = 1500;
  var display = document.getElementById('timer-display');
  display.classList.remove('ended', 'running');
  document.getElementById('timer-status').textContent = 'Timer reset to 25 minutes.';
  renderTimer();
}

function onTimerEnd() {
  var display = document.getElementById('timer-display');
  display.classList.remove('running');
  display.classList.add('ended');
  document.getElementById('timer-status').textContent = 'Focus session complete. Reset the timer to start again.';
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
    var parsed = stored ? JSON.parse(stored) : [];
    tasks = Array.isArray(parsed) ? parsed.filter(function(task) {
      return task && Number.isSafeInteger(task.id) && typeof task.text === 'string' && typeof task.done === 'boolean';
    }) : [];
    if (stored && (!Array.isArray(parsed) || tasks.length !== parsed.length)) saveTasks();
  } catch (e) {
    console.warn('Failed to load tasks:', e);
    tasks = [];
    saveTasks();
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

function getSortedTasks() {
  var sorted = tasks.slice();
  var order = currentSort;

  if (order === 'active') {
    // Undone tasks first
    sorted.sort(function(a, b) {
      var aVal = a.done ? 1 : 0;
      var bVal = b.done ? 1 : 0;
      return aVal - bVal;
    });
  } else if (order === 'done') {
    // Done tasks first
    sorted.sort(function(a, b) {
      var aVal = a.done ? 0 : 1;
      var bVal = b.done ? 0 : 1;
      return aVal - bVal;
    });
  } else if (order === 'az') {
    // Alphabetical A–Z
    sorted.sort(function(a, b) {
      var textA = a.text.toLowerCase();
      var textB = b.text.toLowerCase();
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return 0;
    });
  }
  // 'default': keep original insertion order

  return sorted;
}

function renderTasks() {
  var list = document.getElementById('todo-list');
  list.innerHTML = '';

  var sorted = getSortedTasks();

  if (sorted.length === 0) {
    var empty = document.createElement('li');
    empty.className = 'todo-empty';
    empty.textContent = 'No tasks yet. Add one above!';
    list.appendChild(empty);
    return;
  }

  sorted.forEach(function(task) {
    var li = document.createElement('li');
    if (task.done) li.classList.add('done');
    var taskLabel = escapeHtml(task.text);
    li.innerHTML =
      '<span class="task-text">' + taskLabel + '</span>' +
      '<button class="btn-done" type="button" data-id="' + task.id + '" title="' + (task.done ? 'Mark this task as active' : 'Mark this task as done') + '" aria-label="' + (task.done ? 'Mark ' + taskLabel + ' as active' : 'Mark ' + taskLabel + ' as done') + '">' + (task.done ? 'Undo' : 'Done') + '</button>' +
      '<button class="btn-edit" type="button" data-id="' + task.id + '" title="Change the task text" aria-label="Edit ' + taskLabel + '">Edit</button>' +
      '<button class="btn-delete" type="button" data-id="' + task.id + '" title="Delete this task; Undo is available briefly" aria-label="Delete ' + taskLabel + '">Delete</button>';
    list.appendChild(li);
  });
}

var lastGeneratedId = 0;

function createId(items) {
  var id = Math.max(Date.now(), lastGeneratedId + 1);
  while (items.some(function(item) { return item.id === id; })) id += 1;
  lastGeneratedId = id;
  return id;
}

function addTask(text) {
  var trimmed = text.trim();
  if (!trimmed) return false;
  tasks.push({ id: createId(tasks), text: trimmed, done: false });
  saveTasks();
  renderTasks();
  return true;
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
  var index = tasks.findIndex(function(task) { return task.id === id; });
  if (index < 0) return;
  var deletedTask = tasks[index];
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showUndoToast('Task deleted.', function() {
    tasks.splice(Math.min(index, tasks.length), 0, deletedTask);
    saveTasks();
    renderTasks();
  });
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

function copyDefaultLinks() {
  return DEFAULT_LINKS.map(function(link) { return Object.assign({}, link); });
}

function loadLinks() {
  try {
    var stored = localStorage.getItem('quickLinks');
    if (stored === null) {
      links = copyDefaultLinks();
      saveLinks();
      return;
    }
    var parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      links = copyDefaultLinks();
      saveLinks();
      return;
    }
    var needsSave = false;
    links = parsed.reduce(function(validLinks, link) {
      if (!link || !Number.isSafeInteger(link.id) || typeof link.name !== 'string' || typeof link.url !== 'string') {
        needsSave = true;
        return validLinks;
      }
      var normalized = normalizeLinkUrl(link.url);
      if (normalized.error) {
        needsSave = true;
        return validLinks;
      }
      if (normalized.url !== link.url) needsSave = true;
      validLinks.push({ id: link.id, name: link.name, url: normalized.url });
      return validLinks;
    }, []);
    if (needsSave) saveLinks();
  } catch (e) {
    console.warn('Failed to load links:', e);
    links = copyDefaultLinks();
    saveLinks();
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
  if (links.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'links-empty';
    empty.textContent = 'No quick links yet. Add one below.';
    grid.appendChild(empty);
    return;
  }
  links.forEach(function(link) {
    var card = document.createElement('div');
    card.className = 'link-card';
    card.innerHTML =
      '<a href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(link.name) + '</a>' +
      '<button class="btn-delete-link" type="button" data-id="' + link.id + '" title="Delete this shortcut; Undo is available briefly" aria-label="Delete ' + escapeHtml(link.name) + ' link">Delete</button>';
    grid.appendChild(card);
  });
}

function normalizeLinkUrl(value) {
  var candidate = value.trim();
  if (!candidate) return { error: 'Enter a URL.' };
  var explicitProtocol = candidate.match(/^([a-z][a-z\d+.-]*):\/\//i);
  if (explicitProtocol && explicitProtocol[1].toLowerCase() !== 'http' && explicitProtocol[1].toLowerCase() !== 'https') {
    return { error: 'Use a valid HTTP or HTTPS URL.' };
  }
  if (!explicitProtocol) {
    var protocolLikeValue = /^[a-z][a-z\d+.-]*:/i.test(candidate);
    var hostWithPort = /^[^/:]+:\d+(?:\/|$)/.test(candidate);
    if (protocolLikeValue && !hostWithPort) return { error: 'Use a valid HTTP or HTTPS URL.' };
    candidate = 'https://' + candidate;
  }

  try {
    var parsed = new URL(candidate);
    if ((parsed.protocol !== 'https:' && parsed.protocol !== 'http:') || !parsed.hostname) {
      return { error: 'Use a valid HTTP or HTTPS URL.' };
    }
    return { url: parsed.href };
  } catch (e) {
    return { error: 'Enter a valid URL, such as example.com.' };
  }
}

function addLink(name, url) {
  var trimmedName = name.trim();
  if (!trimmedName) return { error: 'Enter a name for the link.', field: 'name' };
  var normalized = normalizeLinkUrl(url);
  if (normalized.error) return { error: normalized.error, field: 'url' };
  links.push({ id: createId(links), name: trimmedName, url: normalized.url });
  saveLinks();
  renderLinks();
  return { ok: true };
}

function deleteLink(id) {
  var index = links.findIndex(function(link) { return link.id === id; });
  if (index < 0) return;
  var deletedLink = links[index];
  links.splice(index, 1);
  saveLinks();
  renderLinks();
  showUndoToast('Quick link deleted.', function() {
    links.splice(Math.min(index, links.length), 0, deletedLink);
    saveLinks();
    renderLinks();
  });
}

var undoCallback = null;
var undoTimeout = null;

function hideUndoToast() {
  document.getElementById('undo-toast').hidden = true;
  undoCallback = null;
  if (undoTimeout) clearTimeout(undoTimeout);
  undoTimeout = null;
}

function showUndoToast(message, callback) {
  if (undoTimeout) clearTimeout(undoTimeout);
  undoCallback = callback;
  document.getElementById('undo-message').textContent = message;
  document.getElementById('undo-toast').hidden = false;
  undoTimeout = setTimeout(hideUndoToast, 7000);
}

function undoLastDeletion() {
  if (!undoCallback) return;
  var restore = undoCallback;
  hideUndoToast();
  restore();
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
    savedTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch (e) {
    savedTheme = 'dark';
  }
  applyTheme(savedTheme);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Custom name
  loadUserName();
  updateNameButton();

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  document.getElementById('btn-edit-name').addEventListener('click', function() {
    var n = window.prompt("What's your name? (Leave empty to clear)", userName);
    if (n !== null) {
      userName = n.trim();
      saveUserName(userName);
      updateNameButton();
      updateClock();
    }
  });

  // Timer
  renderTimer();
  document.getElementById('btn-start').addEventListener('click', startTimer);
  document.getElementById('btn-stop').addEventListener('click', stopTimer);
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
  document.getElementById('btn-undo').addEventListener('click', undoLastDeletion);

  // To-Do
  loadTasks();
  loadSortPreference();
  renderTasks();

  function submitTaskInput() {
    var input = document.getElementById('todo-input');
    var status = document.getElementById('todo-status');
    if (!addTask(input.value)) {
      status.textContent = 'Enter a task before adding it.';
      input.focus();
      return;
    }
    status.textContent = 'Task added.';
    input.value = '';
    input.focus();
  }

  document.getElementById('btn-add-task').addEventListener('click', submitTaskInput);

  document.getElementById('todo-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') submitTaskInput();
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

  var linkForm = document.getElementById('add-link-form');
  var linkNameInput = document.getElementById('link-name-input');
  var linkUrlInput = document.getElementById('link-url-input');
  var linkFormError = document.getElementById('link-form-error');

  linkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    linkFormError.textContent = '';
    linkNameInput.removeAttribute('aria-invalid');
    linkUrlInput.removeAttribute('aria-invalid');

    var result = addLink(linkNameInput.value, linkUrlInput.value);
    if (!result.ok) {
      linkFormError.textContent = result.error;
      var invalidInput = result.field === 'name' ? linkNameInput : linkUrlInput;
      invalidInput.setAttribute('aria-invalid', 'true');
      invalidInput.focus();
      return;
    }

    linkForm.reset();
    linkNameInput.focus();
  });

  [linkNameInput, linkUrlInput].forEach(function(input) {
    input.addEventListener('input', function() {
      linkNameInput.removeAttribute('aria-invalid');
      linkUrlInput.removeAttribute('aria-invalid');
      linkFormError.textContent = '';
    });
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
