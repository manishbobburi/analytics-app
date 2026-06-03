import express, { Router } from 'express';
const router: Router = express.Router();

import trackRouter from './track.routes.js';

router.use('/tracker', trackRouter);

export default router;
