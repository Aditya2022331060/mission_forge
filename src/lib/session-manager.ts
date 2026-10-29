// Session management and storage cleanup for Mission Forge
export const CURRENT_STORAGE_KEY = "mission-forge-v8";

export const LEGACY_STORAGE_KEYS = [
  "mission-forge-v1",
  "mission-forge-v2",
  "mission-forge-v3",
  "mission-forge-v4",
  "mission-forge-v5",
  "mission-forge-v6",
  "mission-forge-v7",
];

/**
 * Clears old session keys from localStorage so returning users don't encounter
 * incompatible or stale state, and initial entries feel completely fresh.
 */
export function clearLegacySessions(): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn("Unable to clear legacy sessions from localStorage", err);
  }
}

/**
 * Completely resets all Mission Forge data, clearing current and past keys,
 * wiping session storage, and reloading the application so the user starts as a
 * totally new cadet with the first-time video experience.
 */
export function resetAllSessionsAndRestart(): void {
  if (typeof window === "undefined") return;
  try {
    // Remove all versions of mission-forge storage
    localStorage.removeItem(CURRENT_STORAGE_KEY);
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
    // Also remove any stray keys matching mission-forge
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith("mission-forge")) {
        localStorage.removeItem(k);
      }
    }
    sessionStorage.clear();
  } catch (err) {
    console.error("Error during session reset", err);
  }
  // Hard reload to guarantee clean state
  window.location.reload();
}

// Auto-run legacy cleanup on script import
clearLegacySessions();
