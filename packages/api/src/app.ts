import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { serverConfig } from './config/index.js';
import router from './routes/index.js';
import globalErrorHandler from './middleware/errorHandler.js';

const app: Express = express();

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (serverConfig.cors.allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS blocked'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());

app.use(express.json({ limit: serverConfig.limits.bodyLimit }));

app.use(express.urlencoded({ extended: false }));

app.use('/health', (_, res) => res.json({ status: 'OK' }));

app.use('/api', router);

app.use(globalErrorHandler);

export default app;
