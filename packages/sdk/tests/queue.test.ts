import { describe, expect, test } from 'vitest';

import { EventQueue } from '../src/queue';
import type { BaseEvent } from '../src/types';

function createEvent(id: string): BaseEvent {
  return {
    event_id: id,
    event: 'test_event',
    timestamp: Date.now(),
    anon_id: 'anon_123',
    session_id: 'session_123',
    properties: {},
    context: {
      page_url: 'https://mypage.com',
      page_path: '/',
      page_title: 'Test',
      referrer: '',
      user_agent: 'test',
      screen_width: 1920,
      screen_height: 1080,
      language: 'en-US',
      timezone: 'UTC',
    },
  };
}

describe('EventQueue', () => {
  test('starts empty', () => {
    const queue = new EventQueue(10);

    expect(queue.size).toBe(0);
    expect(queue.isEmpty).toBe(true);
  });

  test('adds an event to the queue', () => {
    const queue = new EventQueue(10);
    const event = createEvent('event_1');

    queue.push(event);

    expect(queue.size).toBe(1);
    expect(queue.isEmpty).toBe(false);
  });

  test('preserves event order', () => {
    const queue = new EventQueue(10);

    const event1 = createEvent('event_1');
    const event2 = createEvent('event_2');
    const event3 = createEvent('event_3');

    queue.push(event1);
    queue.push(event2);
    queue.push(event3);

    expect(queue.take(3)).toEqual([event1, event2, event3]);
  });

  test('take removes and returns events from the front of the queue', () => {
    const queue = new EventQueue(10);

    const event1 = createEvent('event_1');
    const event2 = createEvent('event_2');
    const event3 = createEvent('event_3');

    queue.push(event1);
    queue.push(event2);
    queue.push(event3);

    const batch = queue.take(2);

    expect(batch).toEqual([event1, event2]);
    expect(queue.size).toBe(1);
    expect(queue.take(1)).toEqual([event3]);
  });

  test('take returns all available events when count exceeds queue size', () => {
    const queue = new EventQueue(10);

    const event1 = createEvent('event_1');
    const event2 = createEvent('event_2');

    queue.push(event1);
    queue.push(event2);

    expect(queue.take(10)).toEqual([event1, event2]);

    expect(queue.isEmpty).toBe(true);
  });

  test('prepend adds events to the front of the queue', () => {
    const queue = new EventQueue(10);

    const event1 = createEvent('event_1');
    const event2 = createEvent('event_2');
    const failedEvent = createEvent('failed_event');

    queue.push(event1);
    queue.push(event2);

    queue.prepend([failedEvent]);

    expect(queue.take(3)).toEqual([failedEvent, event1, event2]);
  });

  test('respects the maximum queue size', () => {
    const queue = new EventQueue(2);

    const event1 = createEvent('event_1');
    const event2 = createEvent('event_2');
    const event3 = createEvent('event_3');

    queue.push(event1);
    queue.push(event2);
    queue.push(event3);

    expect(queue.size).toBe(2);
    expect(queue.take(2)).toEqual([event2, event3]);
  });

  test('prepend respects the maximum queue size', () => {
    const queue = new EventQueue(3);

    const event1 = createEvent('event_1');
    const event2 = createEvent('event_2');
    const event3 = createEvent('event_3');
    const failedEvent = createEvent('failed_event');

    queue.push(event1);
    queue.push(event2);
    queue.push(event3);

    queue.take(1);

    queue.prepend([failedEvent]);

    expect(queue.size).toBe(3);
    expect(queue.take(3)).toEqual([failedEvent, event2, event3]);
  });

  test('clear removes all events', () => {
    const queue = new EventQueue(10);

    queue.push(createEvent('event_1'));
    queue.push(createEvent('event_2'));

    queue.clear();

    expect(queue.size).toBe(0);
    expect(queue.isEmpty).toBe(true);
    expect(queue.take(10)).toEqual([]);
  });
});
