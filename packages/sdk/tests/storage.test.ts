import { afterEach, describe, expect, test, vi } from 'vitest';
import { createLocalStorage, createSessionStorage } from '../src/storage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createLocalStorage', () => {
  test('uses localStorage when available', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue('value'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('localStorage', storage);

    const adapter = createLocalStorage();

    expect(adapter.get('key')).toBe('value');

    adapter.set('key', 'value');
    expect(storage.setItem).toHaveBeenCalledWith('key', 'value');

    adapter.remove('key');
    expect(storage.removeItem).toHaveBeenCalledWith('key');
  });

  test('uses memory storage when localStorage is unavailable', () => {
    vi.stubGlobal('localStorage', undefined);

    const adapter = createLocalStorage();

    expect(adapter.get('key')).toBeNull();

    adapter.set('key', 'value');
    expect(adapter.get('key')).toBe('value');

    adapter.remove('key');
    expect(adapter.get('key')).toBeNull();
  });

  test('returns null when localStorage getItem throws', () => {
    const storage = {
      getItem: vi.fn().mockImplementation(() => {
        throw new Error('Storage unavailable');
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('localStorage', storage);

    const adapter = createLocalStorage();

    expect(adapter.get('key')).toBeNull();
  });

  test('does not throw when localStorage setItem throws', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn().mockImplementation(() => {
        throw new Error('Storage unavailable');
      }),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('localStorage', storage);

    const adapter = createLocalStorage();

    expect(() => adapter.set('key', 'value')).not.toThrow();
  });

  test('does not throw when localStorage removeItem throws', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn().mockImplementation(() => {
        throw new Error('Storage unavailable');
      }),
    };

    vi.stubGlobal('localStorage', storage);

    const adapter = createLocalStorage();

    expect(() => adapter.remove('key')).not.toThrow();
  });
});

describe('createSessionStorage', () => {
  test('uses sessionStorage when available', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue('value'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('sessionStorage', storage);

    const adapter = createSessionStorage();

    expect(adapter.get('key')).toBe('value');

    adapter.set('key', 'value');
    expect(storage.setItem).toHaveBeenCalledWith('key', 'value');

    adapter.remove('key');
    expect(storage.removeItem).toHaveBeenCalledWith('key');
  });

  test('uses memory storage when sessionStorage is unavailable', () => {
    vi.stubGlobal('sessionStorage', undefined);

    const adapter = createSessionStorage();

    expect(adapter.get('key')).toBeNull();

    adapter.set('key', 'value');
    expect(adapter.get('key')).toBe('value');

    adapter.remove('key');
    expect(adapter.get('key')).toBeNull();
  });

  test('returns null when sessionStorage getItem throws', () => {
    const storage = {
      getItem: vi.fn().mockImplementation(() => {
        throw new Error('Storage unavailable');
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('sessionStorage', storage);

    const adapter = createSessionStorage();

    expect(adapter.get('key')).toBeNull();
  });

  test('does not throw when sessionStorage setItem throws', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn().mockImplementation(() => {
        throw new Error('Storage unavailable');
      }),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('sessionStorage', storage);

    const adapter = createSessionStorage();

    expect(() => adapter.set('key', 'value')).not.toThrow();
  });

  test('does not throw when sessionStorage removeItem throws', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn().mockImplementation(() => {
        throw new Error('Storage unavailable');
      }),
    };

    vi.stubGlobal('sessionStorage', storage);

    const adapter = createSessionStorage();

    expect(() => adapter.remove('key')).not.toThrow();
  });
});
