import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { ClickStreamSDK } from '../src/ClickStreamSdk';

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  sendBeacon: vi.fn(),
  HttpTransport: vi.fn(),
}));

vi.mock('../src/transport', () => ({
  HttpTransport: mocks.HttpTransport,
}));

vi.mock('../src/session', () => ({
  SessionManager: class {
    getAnonId = vi.fn().mockReturnValue('anon-123');
    getSessionId = vi.fn().mockReturnValue('session-123');
    touchSession = vi.fn();
  },
}));

const validConfig = {
  writeKey: 'test-write-key',
  apiUrl: 'https://api.example.com/ingest',
};

beforeEach(() => {
  vi.clearAllMocks();

  mocks.send.mockResolvedValue(undefined);
  mocks.sendBeacon.mockReturnValue(true);

  /*
   * ClickStreamSDK uses:
   *
   *   new HttpTransport(...)
   *
   * Therefore the mock implementation must be constructible.
   * Arrow functions cannot be used with `new`.
   */
  mocks.HttpTransport.mockImplementation(function () {
    return {
      send: mocks.send,
      sendBeacon: mocks.sendBeacon,
    };
  });

  vi.stubGlobal('window', {
    location: {
      href: 'https://example.com/page',
      pathname: '/page',
    },

    screen: {
      width: 1920,
      height: 1080,
    },

    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });

  vi.stubGlobal('document', {
    title: 'Test Page',
    referrer: 'https://google.com',
    visibilityState: 'visible',

    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });

  vi.stubGlobal('navigator', {
    userAgent: 'Vitest',
    language: 'en-US',
    sendBeacon: mocks.sendBeacon,
  });

  vi.stubGlobal('Intl', {
    DateTimeFormat: vi.fn(() => ({
      resolvedOptions: () => ({
        timeZone: 'UTC',
      }),
    })),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ClickStream SDK', () => {
  describe('init', () => {
    test('initializes the SDK successfully', () => {
      const sdk = new ClickStreamSDK();

      expect(() => {
        sdk.init(validConfig);
      }).not.toThrow();
    });

    test('creates transport with configured values', () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      expect(mocks.HttpTransport).toHaveBeenCalledWith(
        validConfig.apiUrl,
        validConfig.writeKey,
        10000
      );
    });

    test('uses default configuration values', () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      expect(() => {
        sdk.track('test_event');
      }).not.toThrow();
    });

    test('does not initialize twice', () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);
      sdk.init(validConfig);

      expect(mocks.HttpTransport).toHaveBeenCalledOnce();
    });

    test('rejects missing writeKey', () => {
      const sdk = new ClickStreamSDK();

      expect(() => {
        sdk.init({
          ...validConfig,
          writeKey: '',
        });
      }).toThrow('ClickStream: writeKey is required.');
    });

    test('rejects invalid apiUrl', () => {
      const sdk = new ClickStreamSDK();

      expect(() => {
        sdk.init({
          ...validConfig,
          apiUrl: 'invalid-url',
        });
      }).toThrow('ClickStream: apiUrl must be a valid URL.');
    });

    test('rejects invalid flushInterval', () => {
      const sdk = new ClickStreamSDK();

      expect(() => {
        sdk.init({
          ...validConfig,
          flushInterval: 0,
        });
      }).toThrow('ClickStream: flushInterval must be greater than 0.');
    });

    test('rejects invalid batchSize', () => {
      const sdk = new ClickStreamSDK();

      expect(() => {
        sdk.init({
          ...validConfig,
          batchSize: 0,
        });
      }).toThrow('ClickStream: batchSize must be greater than 0.');
    });

    test('rejects invalid maxQueueSize', () => {
      const sdk = new ClickStreamSDK();

      expect(() => {
        sdk.init({
          ...validConfig,
          maxQueueSize: 0,
        });
      }).toThrow('ClickStream: maxQueueSize must be greater than 0.');
    });
  });

  describe('track', () => {
    test('does nothing when called before init', () => {
      const sdk = new ClickStreamSDK();

      sdk.track('test_event');

      expect(mocks.send).not.toHaveBeenCalled();
    });

    test('queues a valid event', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init({
        ...validConfig,
        batchSize: 10,
      });

      sdk.track('button_clicked', {
        button: 'signup',
      });

      await sdk.flush();

      expect(mocks.send).toHaveBeenCalledOnce();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch).toHaveLength(1);

      expect(batch[0]).toMatchObject({
        event: 'button_clicked',
        anon_id: 'anon-123',
        session_id: 'session-123',
        properties: {
          button: 'signup',
        },
      });
    });

    test('trims event names', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.track('  button_clicked  ');

      await sdk.flush();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch[0].event).toBe('button_clicked');
    });

    test('ignores invalid event names', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.track('');
      sdk.track('   ');

      await sdk.flush();

      expect(mocks.send).not.toHaveBeenCalled();
    });

    test('includes userId after identify', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.identify('user-123', {
        plan: 'pro',
      });

      sdk.track('purchase', {
        amount: 100,
      });

      await sdk.flush();

      expect(mocks.send).toHaveBeenCalledOnce();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch).toHaveLength(2);

      expect(batch[0]).toMatchObject({
        event: 'identify',
        user_id: 'user-123',
        properties: {
          plan: 'pro',
        },
      });

      expect(batch[1]).toMatchObject({
        event: 'purchase',
        user_id: 'user-123',
        properties: {
          amount: 100,
        },
      });
    });

    test('automatically flushes when batch size is reached', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init({
        ...validConfig,
        batchSize: 2,
      });

      sdk.track('event_one');
      sdk.track('event_two');

      await vi.waitFor(() => {
        expect(mocks.send).toHaveBeenCalledOnce();
      });

      const [batch] = mocks.send.mock.calls[0];

      expect(batch).toHaveLength(2);
    });
  });

  describe('identify', () => {
    test('ignores empty userId', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.identify('');

      await sdk.flush();

      expect(mocks.send).not.toHaveBeenCalled();
    });

    test('tracks identify event with traits', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.identify('user-123', {
        plan: 'pro',
        company: 'Acme',
      });

      await sdk.flush();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch[0]).toMatchObject({
        event: 'identify',
        user_id: 'user-123',
        properties: {
          plan: 'pro',
          company: 'Acme',
        },
      });
    });
  });

  describe('page', () => {
    test('tracks a page_viewed event', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.page('Products');

      await sdk.flush();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch[0]).toMatchObject({
        event: 'page_viewed',
        properties: {
          name: 'Products',
        },
      });
    });

    test('supports page properties', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.page('Products', {
        category: 'electronics',
      });

      await sdk.flush();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch[0].properties).toEqual({
        name: 'Products',
        category: 'electronics',
      });
    });
  });

  describe('consent', () => {
    test('does not track when consent is disabled', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init({
        ...validConfig,
        consent: false,
      });

      sdk.track('test_event');

      await sdk.flush();

      expect(mocks.send).not.toHaveBeenCalled();
    });

    test('allows tracking after consent is granted', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init({
        ...validConfig,
        consent: false,
      });

      sdk.track('blocked_event');

      sdk.consent(true);

      sdk.track('allowed_event');

      await sdk.flush();

      expect(mocks.send).toHaveBeenCalledOnce();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch).toHaveLength(1);

      expect(batch[0].event).toBe('allowed_event');
    });
  });

  describe('flush', () => {
    test('does nothing when queue is empty', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      await sdk.flush();

      expect(mocks.send).not.toHaveBeenCalled();
    });

    test('sends queued events', async () => {
      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.track('event_one');
      sdk.track('event_two');

      await sdk.flush();

      expect(mocks.send).toHaveBeenCalledOnce();

      const [batch] = mocks.send.mock.calls[0];

      expect(batch).toHaveLength(2);
    });

    test('restores events when transport fails', async () => {
      mocks.send.mockRejectedValueOnce(new Error('Network error'));

      const sdk = new ClickStreamSDK();

      sdk.init(validConfig);

      sdk.track('event_one');

      await sdk.flush();
      await sdk.flush();

      expect(mocks.send).toHaveBeenCalledTimes(2);

      const secondBatch = mocks.send.mock.calls[1][0];

      expect(secondBatch).toHaveLength(1);

      expect(secondBatch[0].event).toBe('event_one');
    });
  });
});
