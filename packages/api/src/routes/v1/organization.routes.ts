import express, { Router } from 'express';
const router: Router = express.Router();

import { organizationController } from '../../controllers/index.js';
import { authMiddleware } from '../../middleware/index.js';
import catchAsync from '../../utils/catchAsync.js';

router.post('/create-organization', catchAsync(organizationController.createOrganization));

router.get('/me', authMiddleware.authenticate, catchAsync(organizationController.getOrganization));

export default router;
