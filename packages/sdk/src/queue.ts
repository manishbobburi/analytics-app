import { BaseEvent } from './types';

export class EventQueue {
  private events: BaseEvent[] = [];

  constructor(private readonly maxSize: number) {}

  get size(): number {
    return this.events.length;
  }

  get isEmpty(): boolean {
    return this.events.length === 0;
  }

  push(event: BaseEvent): void {
    if (this.events.length >= this.maxSize) {
      //if queue size is greater than or equal to maxsize, remove the first element from the queue.
      this.events.shift();
    }

    this.events.push(event);
  }

  pushMany(events: BaseEvent[]): void {
    for (const event of events) {
      this.push(event);
    }
  }

  take(count: number): BaseEvent[] {
    return this.events.splice(0, count);
  }

  prepend(events: BaseEvent[]): void {
    this.events.unshift(...events);

    if (this.events.length > this.maxSize) {
      this.events.length = this.maxSize;
    }
  }

  clear(): void {
    this.events = [];
  }
}
