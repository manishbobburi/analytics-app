import { collectDefaultMetrics, Registry, Counter, Histogram } from '@prometheus-io/client';

export const registry = new Registry();

registry.setDefaultLabels({
  service: 'api',
  environment: process.env.NODE_ENV ?? 'development',
});

collectDefaultMetrics({
  register: registry,
  eventLoopMonitoringPrecision: 20,
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of completed HTTP requests.',
  labelNames: ['method', 'route', 'status_code'] as const,
  registers: [registry],
});

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds.',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
});
