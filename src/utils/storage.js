// src/utils/storage.js
export const USERS_KEY = 'quiz_users';
export const CURRENT_USER_KEY = 'current_user';

export function loadUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUserId() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(id) {
    if (id == null) localStorage.removeItem(CURRENT_USER_KEY);
    else localStorage.setItem(CURRENT_USER_KEY, String(id));
}

export function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function findUserByUsername(username) {
    const users = loadUsers();
    return users.find(u => u.username === username);
}

export function getUserById(id) {
    const users = loadUsers();
    return users.find(u => u.id === id);
}

export function updateUser(updated) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
    users[idx] = updated;
    saveUsers(users);
    }
}
// save an array of result objects for a user
export function saveUserResults(userId, results) {
    if (!userId) return null;
    const key = `results_${userId}`;
    const prev = JSON.parse(localStorage.getItem(key) || '[]');

  // create a record with timestamp and a stable hash for deduplication
    const record = {
    id: Date.now(),
    ts: new Date().toISOString(),
    results
    };

  // compute a simple fingerprint of results to detect exact duplicates
    const fingerprint = JSON.stringify(results);

  // check last saved record to avoid duplicates (exact same fingerprint)
    const last = prev[0];
    if (last) {
    try {
        const lastFp = JSON.stringify(last.results);
        if (lastFp === fingerprint) {
        // duplicate detected, do not add a second copy; return the existing record
        return last;
        }
    } catch (e) {
      // if JSON stringify fails for some reason, fall back to adding record
    }
    }

    const next = [record, ...prev];
    localStorage.setItem(key, JSON.stringify(next));
    return record;
}

// return array of saved result records for a user (most recent first)
export function getUserResults(userId) {
    if (!userId) return [];
    const key = `results_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}