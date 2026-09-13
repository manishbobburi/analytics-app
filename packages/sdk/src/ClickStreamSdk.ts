import { BaseEvent, EventProperties, ClickStreamConfig, ResolvedClickStreamConfig } from './types';

import { HttpTransport, Transport } from './transport';

import { EventQueue } from './queue';
import { SessionManager } from './session';

import { generateId, isBrowser, isValidEventName, isValidUrl } from './utils';

const DEFAULT_FLUSH_INTERVAL = 3000;
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_MAX_QUEUE_SIZE = 1000;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_REQUEST_TIMEOUT = 10000;

export class ClickStreamSDK {
  private config?: ResolvedClickStreamConfig;
  private queue?: EventQueue;
  private transport?: Transport;
  private readonly sessionManager = new SessionManager();
  private anonId?: string;
  private sessionId?: string;
  private userId?: string;
  private timer?: ReturnType<typeof setInterval>;
  private isFlushing = false;
  private initialized = false;
  private unloadBound = false;

  init(config: ClickStreamConfig): void {
    if (this.initialized) {
      this.debug('SDK is already initialized.');

      return;
    }

    this.validateConfig(config);

    this.config = {
      writeKey: config.writeKey.trim(),
      apiUrl: config.apiUrl.trim(),
      flushInterval: config.flushInterval ?? DEFAULT_FLUSH_INTERVAL,
      batchSize: config.batchSize ?? DEFAULT_BATCH_SIZE,
      maxQueueSize: config.maxQueueSize ?? DEFAULT_MAX_QUEUE_SIZE,
      maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
      requestTimeout: config.requestTimeout ?? DEFAULT_REQUEST_TIMEOUT,
      consent: config.consent ?? true,
      debug: config.debug ?? false,
    };

    this.queue = new EventQueue(this.config.maxQueueSize);

    this.transport = new HttpTransport(
      this.config.apiUrl,
      this.config.writeKey,
      this.config.requestTimeout
    );

    if (isBrowser()) {
      this.anonId = this.sessionManager.getAnonId();

      this.sessionId = this.sessionManager.getSessionId();

      this.bindLifecycleEvents();

      this.startTimer();
    }

    this.initialized = true;

    this.debug('SDK initialized.');
  }

  identify(userId: string, traits: EventProperties = {}): void {
    if (!userId?.trim()) {
      this.debug('identify() requires a userId.');

      return;
    }

    this.userId = userId;

    this.track('identify', traits);
  }

  page(name?: string, properties: EventProperties = {}): void {
    this.track('page_viewed', {
      ...(name ? { name } : {}),
      ...properties,
    });
  }

  track(event: string, properties: EventProperties = {}): void {
    if (!this.initialized) {
      this.debug('track() called before init().');

      return;
    }

    if (!this.config?.consent) {
      return;
    }

    if (!isValidEventName(event)) {
      this.debug(`Invalid event name: ${event}`);

      return;
    }

    if (!this.queue) {
      return;
    }

    if (this.sessionId) {
      this.sessionManager.touchSession(this.sessionId);
    }

    const baseEvent: BaseEvent = {
      event_id: generateId(),
      event: event.trim(),
      timestamp: Date.now(),
      anon_id: this.anonId ?? '',
      session_id: this.sessionId ?? '',
      ...(this.userId ? { user_id: this.userId } : {}),
      properties,
      context: this.getContext(),
    };

    this.queue.push(baseEvent);

    if (this.queue.size >= this.config.batchSize) {
      void this.flush();
    }
  }

  consent(granted: boolean): void {
    if (!this.config) return;

    this.config.consent = granted;

    if (!granted) {
      this.queue?.clear();
      return;
    }

    void this.flush();
  }

  async flush(): Promise<void> {
    if (!this.initialized || !this.queue || !this.transport || !this.config) {
      return;
    }

    if (this.isFlushing || this.queue.isEmpty) {
      return;
    }

    this.isFlushing = true;

    const batch = this.queue.take(this.config.batchSize);

    try {
      await this.sendWithRetry(batch);

      this.debug(`Successfully sent ${batch.length} events.`);
    } catch (error) {
      this.queue.prepend(batch);
      this.debug('Failed to send events.', error);
    } finally {
      this.isFlushing = false;
    }
  }

  private async sendWithRetry(batch: BaseEvent[]): Promise<void> {
    if (!this.transport || !this.config) {
      return;
    }

    let attempt = 0;

    while (attempt <= this.config.maxRetries) {
      try {
        await this.transport.send(batch);
        return;
      } catch (error) {
        const retryable =
          error instanceof Error && 'retryable' in error
            ? (error as { retryable: boolean }).retryable
            : true;

        if (!retryable || attempt >= this.config.maxRetries) {
          throw error;
        }

        const delay = Math.min(1000 * 2 ** attempt, 10000);

        await this.sleep(delay);
        attempt++;
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private validateConfig(config: ClickStreamConfig): void {
    if (!config.writeKey || !config.writeKey.trim()) {
      throw new Error('ClickStream: writeKey is required.');
    }

    if (!config.apiUrl || !isValidUrl(config.apiUrl)) {
      throw new Error('ClickStream: apiUrl must be a valid URL.');
    }

    if (config.flushInterval !== undefined && config.flushInterval <= 0) {
      throw new Error('ClickStream: flushInterval must be greater than 0.');
    }

    if (config.batchSize !== undefined && config.batchSize <= 0) {
      throw new Error('ClickStream: batchSize must be greater than 0.');
    }

    if (config.maxQueueSize !== undefined && config.maxQueueSize <= 0) {
      throw new Error('ClickStream: maxQueueSize must be greater than 0.');
    }

    if (
      config.maxRetries !== undefined &&
      (config.maxRetries < 0 || !Number.isInteger(config.maxRetries))
    ) {
      throw new Error('ClickStream: maxRetries must be a non-negative integer.');
    }

    if (config.requestTimeout !== undefined && config.requestTimeout <= 0) {
      throw new Error('ClickStream: requestTimeout must be greater than 0.');
    }

    const url = new URL(config.apiUrl);

    if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      throw new Error('ClickStream: apiUrl must use HTTPS.');
    }
  }

  private startTimer(): void {
    if (!this.config || this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      void this.flush();
    }, this.config.flushInterval);
  }

  private stopTimer(): void {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = undefined;
  }

  private bindLifecycleEvents(): void {
    if (!isBrowser() || this.unloadBound) {
      return;
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    window.addEventListener('pagehide', this.handlePageHide);

    this.unloadBound = true;
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.flushWithBeacon();
    }
  };

  private handlePageHide = (): void => {
    this.flushWithBeacon();
  };

  private flushWithBeacon(): void {
    if (!this.queue || !this.transport || this.queue.isEmpty || this.isFlushing) {
      return;
    }

    const batch = this.queue.take(this.config?.batchSize ?? DEFAULT_BATCH_SIZE);

    const sent = this.transport.sendBeacon(batch);

    if (!sent) {
      this.queue.prepend(batch);
    }
  }

  private getContext() {
    if (!isBrowser()) {
      return {
        page_url: '',
        page_path: '',
        page_title: '',
        referrer: '',
        user_agent: '',
        screen_width: 0,
        screen_height: 0,
        language: '',
        timezone: '',
      };
    }

    return {
      page_url: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  destroy(): void {
    this.stopTimer();

    if (isBrowser() && this.unloadBound) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);

      window.removeEventListener('pagehide', this.handlePageHide);

      this.unloadBound = false;
    }

    this.queue?.clear();
    this.initialized = false;
  }

  private debug(message: string, error?: unknown): void {
    if (!this.config?.debug) {
      return;
    }

    if (error) {
      console.debug(`[ClickStream] ${message}`, error);

      return;
    }

    console.debug(`[ClickStream] ${message}`);
  }
}
