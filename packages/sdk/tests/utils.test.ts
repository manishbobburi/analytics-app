import { test, expect, describe, vi, afterEach } from 'vitest';
import { isValidUrl, isValidEventName, generateId, isBrowser } from '../src/utils';

describe('isValidUrl', () => {
  test('returns true for a valid HTTP URL', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('returns true for a valid HTTPS URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  test('returns true for a URL with a path and query parameters', () => {
    expect(isValidUrl('https://example.com/path?foo=bar&baz=qux#section')).toBe(true);
  });

  test('returns true for a URL with a port', () => {
    expect(isValidUrl('https://example.com:8080')).toBe(true);
  });

  test('returns false for an invalid URL', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });

  test('returns false for a malformed URL', () => {
    expect(isValidUrl('https://')).toBe(false);
  });

  test('returns false for a URL with spaces', () => {
    expect(isValidUrl('https://example .com')).toBe(false);
  });

  test('returns true for a URL with a subdomain', () => {
    expect(isValidUrl('https://api.example.com')).toBe(true);
  });

  test('returns true for a localhost URL', () => {
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });
});

describe('isValidEventName', () => {
  test('returns true for a valid event name', () => {
    expect(isValidEventName('user.created')).toBe(true);
  });

  test('returns true for an event name with spaces', () => {
    expect(isValidEventName('user created')).toBe(true);
  });

  test('returns false for an empty string', () => {
    expect(isValidEventName('')).toBe(false);
  });

  test('returns false for a whitespace-only string', () => {
    expect(isValidEventName('   ')).toBe(false);
  });

  test('returns false when event name exceeds 128 characters', () => {
    expect(isValidEventName('a'.repeat(129))).toBe(false);
  });

  test('returns true when event name is exactly 128 characters', () => {
    expect(isValidEventName('a'.repeat(128))).toBe(true);
  });

  test('returns true when event name has surrounding whitespace', () => {
    expect(isValidEventName('  user.created  ')).toBe(true);
  });

  test('returns false for a non-string value', () => {
    expect(isValidEventName(null as unknown as string)).toBe(false);
    expect(isValidEventName(undefined as unknown as string)).toBe(false);
    expect(isValidEventName(123 as unknown as string)).toBe(false);
  });
});

describe('isBrowser', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('returns true when window and document are defined', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {});

    expect(isBrowser()).toBe(true);
  });

  test('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', {});

    expect(isBrowser()).toBe(false);
  });

  test('returns false when document is undefined', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', undefined);

    expect(isBrowser()).toBe(false);
  });

  test('returns false when window and document are undefined', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    expect(isBrowser()).toBe(false);
  });
});

describe('generateId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('returns crypto.randomUUID when available', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(uuid),
    });

    expect(generateId()).toBe(uuid);
  });

  test('falls back to Date.now and Math.random when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {});

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    vi.spyOn(Math, 'random').mockReturnValue(0.123456);

    const id = generateId();

    expect(id).toBe(`1234567890-${(0.123456).toString(36).slice(2)}`);
  });

  test('falls back when crypto is undefined', () => {
    vi.stubGlobal('crypto', undefined);

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    vi.spyOn(Math, 'random').mockReturnValue(0.123456);

    const id = generateId();

    expect(id).toBe(`1234567890-${(0.123456).toString(36).slice(2)}`);
  });

  test('falls back when crypto.randomUUID is not a function', () => {
    vi.stubGlobal('crypto', {
      randomUUID: 'not-a-function',
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    vi.spyOn(Math, 'random').mockReturnValue(0.123456);

    const id = generateId();

    expect(id).toBe(`1234567890-${(0.123456).toString(36).slice(2)}`);
  });
});
