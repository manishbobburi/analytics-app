import express, { Router } from 'express';
const router: Router = express.Router();
import { organizationController } from '../../controllers/index.js';
import { rateLimiter } from '../../middleware/index.js';
import { authMiddleware } from '../../middleware/index.js';
import catchAsync from '../../utils/catchAsync.js';

router.post(
  '/create-organization',
  rateLimiter.registerLimiter,
  catchAsync(organizationController.createOrganization)
);

router.get(
  '/me',
  rateLimiter.authenticatedLimiter,
  authMiddleware.authenticate,
  catchAsync(organizationController.getOrganization)
);

export default router;
