const HISTORY_KEY = 'syphrone-history';
const LEGACY_KEY = 'onyx-history';
const MAX_ENTRIES = 50;

// ─── Migrate legacy key ──────────────────────────────────────────────────
function migrate() {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy && !localStorage.getItem(HISTORY_KEY)) {
    localStorage.setItem(HISTORY_KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
  }
}

export function getHistory() {
  migrate();
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry) {
  const history = getHistory();
  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    timestamp: Date.now(),
    ...entry,
  };
  history.unshift(newEntry);
  if (history.length > MAX_ENTRIES) history.splice(MAX_ENTRIES);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return newEntry;
}

export function deleteHistoryEntry(id) {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
