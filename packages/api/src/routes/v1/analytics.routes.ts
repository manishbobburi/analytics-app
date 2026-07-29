import express, { Router } from 'express';
const router: Router = express.Router();

import { analyticsController } from '../../controllers/index.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import catchAsync from '../../utils/catchAsync.js';

router.get('/overview', authenticate, catchAsync(analyticsController.getOverview));

router.get('/event-trend', authenticate, catchAsync(analyticsController.getEventTrend));

router.get('/breakdown', authenticate, catchAsync(analyticsController.getBreakdown));

export default router;
