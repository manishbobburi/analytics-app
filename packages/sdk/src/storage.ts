export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

class BrowserStorage implements StorageAdapter {
  constructor(private readonly storage: Storage) {}

  get(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch {
      // Storage may be unavailable. Even in that case sdk should continue functioning.
    }
  }

  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch {
      // ignore storage failures.
    }
  }
}

class MemoryStorage implements StorageAdapter {
  private readonly store = new Map<string, string>();

  get(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  remove(key: string): void {
    this.store.delete(key);
  }
}

export function createLocalStorage(): StorageAdapter {
  if (typeof localStorage === 'undefined') {
    return new MemoryStorage();
  }

  return new BrowserStorage(localStorage);
}

export function createSessionStorage(): StorageAdapter {
  if (typeof sessionStorage === 'undefined') {
    return new MemoryStorage();
  }

  return new BrowserStorage(sessionStorage);
}
