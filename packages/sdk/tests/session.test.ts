import { beforeEach, describe, expect, test, vi } from 'vitest';

import { SessionManager } from '../src/session';

const mockLocalStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

const mockSessionStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

vi.mock('../src/storage', () => ({
  createLocalStorage: () => mockLocalStorage,
  createSessionStorage: () => mockSessionStorage,
}));

describe('SessionManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAnonId', () => {
    test('returns existing anonymous ID', () => {
      mockLocalStorage.get.mockReturnValue('anon_existing');

      const manager = new SessionManager();

      expect(manager.getAnonId()).toBe('anon_existing');
      expect(mockLocalStorage.set).not.toHaveBeenCalled();
    });

    test('creates and stores a new anonymous ID when none exists', () => {
      mockLocalStorage.get.mockReturnValue(null);

      const manager = new SessionManager();

      const anonId = manager.getAnonId();

      expect(anonId).toEqual(expect.any(String));

      expect(mockLocalStorage.set).toHaveBeenCalledWith('click_stream_anon_id', anonId);
    });

    test('returns the same anonymous ID on subsequent calls', () => {
      mockLocalStorage.get.mockReturnValue(null);

      const manager = new SessionManager();

      const firstId = manager.getAnonId();

      mockLocalStorage.get.mockReturnValue(firstId);

      const secondId = manager.getAnonId();

      expect(secondId).toBe(firstId);
    });
  });

  describe('getSessionId', () => {
    test('creates and stores a new session when none exists', () => {
      mockSessionStorage.get.mockReturnValue(null);

      const manager = new SessionManager();

      const sessionId = manager.getSessionId();

      expect(sessionId).toEqual(expect.any(String));

      expect(mockSessionStorage.set).toHaveBeenCalledWith(
        'click_stream_session',
        expect.any(String)
      );
    });

    test('returns an existing active session', () => {
      const sessionId = 'session_existing';

      mockSessionStorage.get.mockReturnValue(
        JSON.stringify({
          id: sessionId,
          last_seen: Date.now(),
        })
      );

      const manager = new SessionManager();

      expect(manager.getSessionId()).toBe(sessionId);
    });

    test('updates last_seen when returning an active session', () => {
      const sessionId = 'session_existing';

      mockSessionStorage.get.mockReturnValue(
        JSON.stringify({
          id: sessionId,
          last_seen: Date.now() - 1000,
        })
      );

      const manager = new SessionManager();

      manager.getSessionId();

      expect(mockSessionStorage.set).toHaveBeenCalledWith(
        'click_stream_session',
        expect.stringContaining(sessionId)
      );
    });

    test('creates a new session when the existing session has expired', () => {
      const oldSessionId = 'session_old';

      mockSessionStorage.get.mockReturnValue(
        JSON.stringify({
          id: oldSessionId,
          last_seen: Date.now() - 30 * 60 * 1000 - 1,
        })
      );

      const manager = new SessionManager();

      const newSessionId = manager.getSessionId();

      expect(newSessionId).not.toBe(oldSessionId);

      expect(mockSessionStorage.set).toHaveBeenCalledWith(
        'click_stream_session',
        expect.any(String)
      );
    });

    test('creates a new session when stored session data is invalid JSON', () => {
      mockSessionStorage.get.mockReturnValue('invalid-json');

      const manager = new SessionManager();

      const sessionId = manager.getSessionId();

      expect(sessionId).toEqual(expect.any(String));

      expect(mockSessionStorage.remove).toHaveBeenCalledWith('click_stream_session');

      expect(mockSessionStorage.set).toHaveBeenCalledWith(
        'click_stream_session',
        expect.any(String)
      );
    });

    test('creates a new session when stored session has an invalid ID', () => {
      mockSessionStorage.get.mockReturnValue(
        JSON.stringify({
          id: 123,
          last_seen: Date.now(),
        })
      );

      const manager = new SessionManager();

      const sessionId = manager.getSessionId();

      expect(sessionId).toEqual(expect.any(String));

      expect(mockSessionStorage.set).toHaveBeenCalled();
    });

    test('creates a new session when stored session has an invalid timestamp', () => {
      mockSessionStorage.get.mockReturnValue(
        JSON.stringify({
          id: 'session_invalid',
          last_seen: 'invalid',
        })
      );

      const manager = new SessionManager();

      const sessionId = manager.getSessionId();

      expect(sessionId).toEqual(expect.any(String));

      expect(mockSessionStorage.set).toHaveBeenCalled();
    });
  });

  describe('touchSession', () => {
    test('updates the session timestamp', () => {
      const manager = new SessionManager();

      manager.touchSession('session_123');

      expect(mockSessionStorage.set).toHaveBeenCalledWith(
        'click_stream_session',
        expect.any(String)
      );

      const [, storedValue] = mockSessionStorage.set.mock.calls[0];

      expect(JSON.parse(storedValue)).toMatchObject({
        id: 'session_123',
      });
    });
  });
});
