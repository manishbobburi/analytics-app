import { afterEach, describe, expect, test, vi } from 'vitest';

import { HttpTransport, TransportError } from '../src/transport';

const API_URL = 'https://api.example.com/ingest';
const WRITE_KEY = 'test-write-key';
const REQUEST_TIMEOUT = 10000;

const events = [
  {
    event_id: 'event-1',
    event: 'button_clicked',
    timestamp: 1700000000000,
    anon_id: 'anon-1',
    session_id: 'session-1',
    properties: {
      button: 'signup',
    },
    context: {
      page_url: 'https://example.com',
      page_path: '/',
      page_title: 'Home',
      referrer: '',
      user_agent: 'Vitest',
      screen_width: 1920,
      screen_height: 1080,
      language: 'en-US',
      timezone: 'Asia/Kolkata',
    },
  },
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('HttpTransport', () => {
  describe('send', () => {
    test('sends events to the configured API', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });

      vi.stubGlobal('fetch', fetchMock);

      const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

      await transport.send(events);

      expect(fetchMock).toHaveBeenCalledOnce();

      expect(fetchMock).toHaveBeenCalledWith(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          write_key: WRITE_KEY,
          batch: events,
        }),
        keepalive: true,
        signal: expect.any(AbortSignal),
      });
    });

    test('resolves when the server responds successfully', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        })
      );

      const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

      await expect(transport.send(events)).resolves.toBeUndefined();
    });

    test('throws TransportError for a failed HTTP response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

      await expect(transport.send(events)).rejects.toBeInstanceOf(TransportError);
    });

    test('includes the HTTP status in TransportError', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
        })
      );

      const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

      try {
        await transport.send(events);
        expect.fail('Expected transport.send() to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(TransportError);

        expect((error as TransportError).status).toBe(400);
      }
    });

    test('throws TransportError when fetch fails due to a network error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

      await expect(transport.send(events)).rejects.toBeInstanceOf(TransportError);
    });

    describe('sendBeacon', () => {
      test('returns false when sendBeacon is unavailable', () => {
        vi.stubGlobal('navigator', {});

        const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

        expect(transport.sendBeacon(events)).toBe(false);
      });

      test('sends events using navigator.sendBeacon', async () => {
        const sendBeaconMock = vi.fn().mockReturnValue(true);

        vi.stubGlobal('navigator', {
          sendBeacon: sendBeaconMock,
        });

        const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

        const result = transport.sendBeacon(events);

        expect(result).toBe(true);
        expect(sendBeaconMock).toHaveBeenCalledOnce();

        const [url, body] = sendBeaconMock.mock.calls[0];

        expect(url).toBe(API_URL);
        expect(body).toBeInstanceOf(Blob);
        expect(body.type).toBe('application/json');

        expect(await (body as Blob).text()).toBe(
          JSON.stringify({
            write_key: WRITE_KEY,
            batch: events,
          })
        );
      });

      test('returns false when sendBeacon rejects the request', () => {
        const sendBeaconMock = vi.fn().mockReturnValue(false);

        vi.stubGlobal('navigator', {
          sendBeacon: sendBeaconMock,
        });

        const transport = new HttpTransport(API_URL, WRITE_KEY, REQUEST_TIMEOUT);

        expect(transport.sendBeacon(events)).toBe(false);
      });
    });
  });
});

describe('TransportError', () => {
  test('sets the error name', () => {
    const error = new TransportError('Request failed', 500);

    expect(error.name).toBe('TransportError');
  });

  test('stores the HTTP status', () => {
    const error = new TransportError('Request failed', 429);

    expect(error.status).toBe(429);
  });
});
