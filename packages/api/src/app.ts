import express, { Express } from 'express';
import cors from 'cors';
import { serverConfig } from './config/index.js';

const app: Express = express();

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (serverConfig.cors.allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS blocked'));
    },
  })
);

app.use(express.json({ limit: serverConfig.limits.bodyLimit }));

app.use('/health', (_, res) => res.json({ status: 'OK' }));

export default app;
