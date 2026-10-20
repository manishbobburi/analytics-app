import type { Request, RequestHandler } from 'express';
import { httpRequestsTotal, httpRequestDurationSeconds } from '../observability/metrics.js';

function getRouteLabel(req: Request): string {
  if (req.route?.path) {
    return `${req.baseUrl}${req.route.path}`;
  }

  return 'unmatched';
}

export const requestMetricsMiddleware: RequestHandler = (req, res, next) => {
  if (req.path === '/metrics') {
    return next();
  }

  const startTimer = httpRequestDurationSeconds.startTimer();

  res.once('finish', () => {
    const labels = {
      method: req.method,
      route: getRouteLabel(req),
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    startTimer(labels);
  });

  next();
};
