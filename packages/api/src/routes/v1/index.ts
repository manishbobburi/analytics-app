import express, { Router } from 'express';
const router: Router = express.Router();

import eventRouter from './event.routes.js';
import writeKeyRouter from './writeKey.routes.js';
import authRouter from './auth.routes.js';

router.use('/events', eventRouter);

router.use('/writeKey', writeKeyRouter);

router.use('/auth', authRouter);

export default router;
