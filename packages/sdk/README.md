# @clickstream/sdk

A lightweight, browser-first analytics SDK for collecting product usage and user interaction events with ClickStream.

## Features

- Event tracking with custom properties
- User identification and traits
- Page view tracking
- Anonymous user and session management
- Event batching and queued delivery
- Automatic retry handling
- Configurable request timeout
- Consent management
- `sendBeacon` support for reliable delivery during page lifecycle events
- TypeScript support
- Small browser-friendly bundle

## Installation

```bash
npm install @clickstream/sdk
```

or

```bash
pnpm add @clickstream/sdk
```

## Quick Start

```ts
import ClickStream from '@clickstream/sdk';

ClickStream.init({
  writeKey: 'YOUR_WRITE_KEY',
  apiUrl: 'https://api.example.com',
});

ClickStream.track('button_clicked', {
  button: 'signup',
});
```

Once initialized, events are queued and delivered to the ClickStream ingestion API.

## Configuration

```ts
ClickStream.init({
  writeKey: 'YOUR_WRITE_KEY',
  apiUrl: 'https://api.example.com',

  // Optional
  maxRetries: 3,
  requestTimeout: 10000,
});
```

| Option           | Type     | Required | Description                                                                                        |
| ---------------- | -------- | -------: | -------------------------------------------------------------------------------------------------- |
| `writeKey`       | `string` |      Yes | Project/write key used to associate events with a ClickStream project.                             |
| `apiUrl`         | `string` |      Yes | ClickStream API endpoint used for event ingestion. HTTPS is required except for local development. |
| `maxRetries`     | `number` |       No | Maximum number of retry attempts for retryable requests.                                           |
| `requestTimeout` | `number` |       No | Maximum request duration in milliseconds.                                                          |

## API

### `init(config)`

Initializes the SDK.

```ts
ClickStream.init({
  writeKey: 'YOUR_WRITE_KEY',
  apiUrl: 'https://api.example.com',
});
```

The SDK must be initialized before tracking events.

### `identify(userId, traits?)`

Associates subsequent events with a known user.

```ts
ClickStream.identify('user-123', {
  plan: 'pro',
  role: 'admin',
});
```

### `track(event, properties?)`

Tracks a custom event.

```ts
ClickStream.track('checkout_completed', {
  orderId: 'order-123',
  value: 49.99,
  currency: 'USD',
});
```

Event properties can contain primitive values, arrays, and nested objects.

### `page(name?, properties?)`

Tracks a page view.

```ts
ClickStream.page('Pricing', {
  source: 'navbar',
});
```

### `consent(granted)`

Controls whether analytics collection is allowed.

```ts
ClickStream.consent(true);
```

To disable analytics collection:

```ts
ClickStream.consent(false);
```

Applications should obtain consent according to the privacy requirements applicable to their users and jurisdiction.

### `flush()`

Immediately attempts to send queued events.

```ts
await ClickStream.flush();
```

This can be useful when an application needs to explicitly trigger event delivery.

## Event Delivery

Events are added to an in-memory queue before being sent to the ingestion API.

The SDK batches queued events and sends them using HTTP requests. If a request fails, events are retained and can be retried according to the configured retry policy.

For browser lifecycle events, the SDK can use `navigator.sendBeacon()` to improve delivery reliability when a page is being unloaded or hidden.

## User and Session Management

The SDK maintains an anonymous identifier for users who have not been explicitly identified.

It also maintains session information to group activity into sessions.

Anonymous identity and session state are persisted using browser storage when available, with an in-memory fallback when browser storage is unavailable.

## Reliability

The SDK supports:

- Request timeouts
- Configurable retry attempts
- Event queue restoration after failed delivery
- Batched event transmission
- `sendBeacon` delivery during page lifecycle events

These mechanisms are designed to prevent transient network failures from immediately causing event loss.

## Development

From the repository root:

Run tests:

```bash
pnpm --filter @clickstream/sdk test
```

Run type checking:

```bash
pnpm --filter @clickstream/sdk typecheck
```

Build the package:

```bash
pnpm --filter @clickstream/sdk build
```

## Browser Usage

The SDK is designed primarily for browser applications.

```ts
import ClickStream from '@clickstream/sdk';

ClickStream.init({
  writeKey: 'YOUR_WRITE_KEY',
  apiUrl: 'https://api.example.com',
});

ClickStream.page('Home');

ClickStream.track('signup_started', {
  source: 'landing_page',
});
```

## TypeScript

The SDK includes TypeScript declarations and can be used directly from TypeScript projects.

```ts
import ClickStream, {
  ClickStreamSDK,
  type ClickStreamConfig,
  type EventProperties,
} from '@clickstream/sdk';
```
