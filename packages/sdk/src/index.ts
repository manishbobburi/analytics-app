import { PulseConfig, BaseEvent, ContentProperties } from './types';

class PulseSDK {
  private config: Required<PulseConfig>;
  private queue: BaseEvent[] = [];
  private anonId: string;
  private sessionId: string;
  private userId?: string;
  private timer?: number;

  constructor() {
    this.config = {
      writeKey: '',
      apiUrl: 'http://localhost:3001/api/v1/events/',
      flushInterval: 3000,
      batchSize: 10,
      consent: true,
    };
    this.anonId = this.getAnonId();
    this.sessionId = this.getSessionId();
    this.bindUnload();
  }

  init(writeKey: string, opts: Partial<PulseConfig> = {}) {
    this.config = { ...this.config, ...opts, writeKey };
    if (!writeKey) throw new Error('Pulse: writeKey required');
    this.startTimer();
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.userId = userId;
    this.track('identify', traits || {});
  }

  page(name?: string, props?: Record<string, any>) {
    this.track('page_viewed', { name, ...props });
  }

  track(event: string, properties: Record<string, any> = {}) {
    if (!this.config.writeKey) return;
    if (!this.config.consent) return;

    const baseEvent: BaseEvent = {
      event_id: crypto.randomUUID(),
      event,
      timestamp: Date.now(),
      anon_id: this.anonId,
      session_id: this.sessionId,
      user_id: this.userId,
      properties,
      context: this.getContext(),
    };

    this.queue.push(baseEvent);
    if (this.queue.length >= this.config.batchSize) this.flush();
  }

  trackVideoStart(props: ContentProperties) {
    this.track('content_started', { ...props, content_type: props.content_type || 'video' });
  }

  trackVideoProgress(props: ContentProperties) {
    this.track('content_progress', { ...props, content_type: props.content_type || 'video' });
  }

  trackVideoEnd(props: ContentProperties & { completed: boolean }) {
    this.track('content_completed', { ...props, content_type: props.content_type || 'video' });
  }

  consent(granted: boolean) {
    this.config.consent = granted;
    if (granted) this.flush();
  }

  private async flush() {
    if (this.queue.length === 0) return;
    const batch = [...this.queue];
    this.queue = [];

    try {
      await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          write_key: this.config.writeKey,
          batch,
        }),
        keepalive: true,
      });
    } catch {
      this.queue = [...batch, ...this.queue];
    }
  }

  private startTimer() {
    this.timer = window.setInterval(() => this.flush(), this.config.flushInterval);
  }

  private getAnonId(): string {
    let id = localStorage.getItem('pulse_anon_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('pulse_anon_id', id);
    }
    return id;
  }

  private getSessionId(): string {
    const KEY = 'pulse_session';
    const EXPIRY = 30 * 60 * 1000;
    const now = Date.now();
    const stored = sessionStorage.getItem(KEY);

    if (stored) {
      const { id, ts } = JSON.parse(stored);
      if (now - ts < EXPIRY) {
        sessionStorage.setItem(KEY, JSON.stringify({ id, ts: now }));
        return id;
      }
    }
    const id = crypto.randomUUID();
    sessionStorage.setItem(KEY, JSON.stringify({ id, ts: now }));
    return id;
  }

  private getContext() {
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

  private bindUnload() {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    });
  }
}

const pulseInstance = new PulseSDK();

if (typeof window !== 'undefined') {
  const w = window as any;

  if (w.Pulse && Array.isArray(w.Pulse.q)) {
    w.Pulse.q.forEach((item: any[]) => {
      const [method, args] = item;
      if (typeof (pulseInstance as any)[method] === 'function') {
        (pulseInstance as any)[method].apply(pulseInstance, args);
      }
    });
  }
  w.Pulse = pulseInstance;
}

export default pulseInstance;
