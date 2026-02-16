const SESSION_KEY = 'wss-session-id';
const EXPIRY_MS = 24 * 60 * 60 * 1000;

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function hasTrackedRecently(pageKey: string): boolean {
  if (typeof window === 'undefined') return false;
  const storageKey = `wss-tracked-${pageKey}`;
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return false;
  const timestamp = Number(raw);
  if (Date.now() - timestamp < EXPIRY_MS) return true;
  sessionStorage.removeItem(storageKey);
  return false;
}

export function markTracked(pageKey: string): void {
  if (typeof window === 'undefined') return;
  const storageKey = `wss-tracked-${pageKey}`;
  sessionStorage.setItem(storageKey, String(Date.now()));
}

export function hasVoted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('tv-vote') !== null;
}

export function getVoteChoice(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tv-vote');
}

export function setVoteChoice(voteType: 'best' | 'good'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('tv-vote', voteType);
}
