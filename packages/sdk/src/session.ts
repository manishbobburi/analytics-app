import { createLocalStorage, createSessionStorage } from './storage';

import { generateId } from './utils';

interface StoredSession {
  id: string;
  last_seen: number;
}

const ANON_ID_KEY = 'click_stream_anon_id';
const SESSION_KEY = 'click_stream_session';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export class SessionManager {
  private readonly localStorage = createLocalStorage();
  private readonly sessionStorage = createSessionStorage();

  getAnonId(): string {
    const existing = this.localStorage.get(ANON_ID_KEY);

    if (existing) {
      return existing;
    }

    const id = generateId();

    this.localStorage.set(ANON_ID_KEY, id);

    return id;
  }

  getSessionId(): string {
    const now = Date.now();
    const stored = this.sessionStorage.get(SESSION_KEY);

    if (stored) {
      try {
        const session = JSON.parse(stored) as StoredSession;

        if (
          typeof session.id === 'string' &&
          typeof session.last_seen === 'number' &&
          now - session.last_seen < SESSION_TIMEOUT_MS
        ) {
          this.updateSession(session.id, now);

          return session.id;
        }
      } catch {
        this.sessionStorage.remove(SESSION_KEY);
      }
    }

    const id = generateId();

    this.updateSession(id, now);

    return id;
  }

  touchSession(sessionId: string): void {
    this.updateSession(sessionId, Date.now());
  }

  private updateSession(id: string, timestamp: number): void {
    const session: StoredSession = {
      id,
      last_seen: timestamp,
    };

    this.sessionStorage.set(SESSION_KEY, JSON.stringify(session));
  }
}
