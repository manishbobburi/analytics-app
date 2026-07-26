import express, { Router } from 'express';
const router: Router = express.Router();

import { analyticsController } from '../../controllers/index.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import catchAsync from '../../utils/catchAsync.js';

router.get('/overview', authenticate, catchAsync(analyticsController.getOverview));

export default router;
