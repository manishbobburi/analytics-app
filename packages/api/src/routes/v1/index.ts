import express, { Router } from 'express';
const router: Router = express.Router();

import eventRouter from './event.routes.js';
import writeKeyRouter from './writeKey.routes.js';
import authRouter from './auth.routes.js';
import analyticsRouter from './analytics.routes.js';
import organizationRouter from './organization.routes.js';
import { rateLimiter } from '../../middleware/index.js';

router.use('/events', eventRouter);

router.use('/writeKey', writeKeyRouter);

router.use('/auth', authRouter);

router.use('/analytics', rateLimiter.authenticatedLimiter, analyticsRouter);

router.use('/organization', organizationRouter);

export default router;
