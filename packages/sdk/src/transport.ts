import { BaseEvent, IngestionPayload } from './types';

export interface Transport {
  send(events: BaseEvent[]): Promise<void>;
  sendBeacon(events: BaseEvent[]): boolean;
}

export class HttpTransport implements Transport {
  constructor(
    private readonly apiUrl: string,
    private readonly writeKey: string,
    private readonly requestTimeout: number
  ) {}

  async send(events: BaseEvent[]): Promise<void> {
    const payload: IngestionPayload = {
      write_key: this.writeKey,
      batch: events,
    };

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, this.requestTimeout);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new TransportError(
          `ClickStream ingestion failed with status ${response.status}`,
          response.status,
          this.isRetryableStatus(response.status)
        );
      }
    } catch (error) {
      if (error instanceof TransportError) {
        throw error;
      }

      throw new TransportError('ClickStream ingestion request failed.', undefined, true);
    } finally {
      clearTimeout(timeout);
    }
  }

  sendBeacon(events: BaseEvent[]): boolean {
    if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
      return false;
    }

    const payload: IngestionPayload = {
      write_key: this.writeKey,
      batch: events,
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });

    return navigator.sendBeacon(this.apiUrl, blob);
  }

  private isRetryableStatus(status: number): boolean {
    return status === 408 || status === 429 || status >= 500;
  }
}

export class TransportError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable: boolean = true
  ) {
    super(message);
    this.name = 'TransportError';
  }
}
