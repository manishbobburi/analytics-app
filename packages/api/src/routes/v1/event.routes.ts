import express, { Router } from 'express';
const router: Router = express.Router();

import { eventController } from '../../controllers/index.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import catchAsync from '../../utils/catchAsync.js';

router.post('/', catchAsync(eventController.ingestEvents));

router.get('/', authenticate, catchAsync(eventController.getEvents));

router.get('/:eventId', authenticate, catchAsync(eventController.getEventByEventId));

export default router;
