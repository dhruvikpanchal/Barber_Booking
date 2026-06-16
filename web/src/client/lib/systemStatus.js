const listeners = new Set();

const state = {
  databaseUnavailable: false,
  demoMode: false,
  message: "",
};

function notify() {
  for (const listener of listeners) {
    listener({ ...state });
  }
}

export function getSystemStatus() {
  return { ...state };
}

export function subscribeSystemStatus(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markDatabaseUnavailable(message) {
  if (state.databaseUnavailable && state.message === message) return;
  state.databaseUnavailable = true;
  state.message = message || "Database is temporarily unavailable.";
  notify();
}

export function clearDatabaseUnavailable() {
  if (!state.databaseUnavailable) return;
  state.databaseUnavailable = false;
  state.message = "";
  notify();
}

let demoWarned = false;

export function markDemoMode(active, reason) {
  state.demoMode = active;
  if (active && !demoWarned) {
    demoWarned = true;
    console.info("[demo] Showing sample data:", reason || "API unavailable");
  }
  if (!active) demoWarned = false;
  notify();
}
