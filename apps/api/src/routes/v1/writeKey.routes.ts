import express, { Router } from 'express';
const router: Router = express.Router();

import { writeKeyController } from '../../controllers/index.js';
import { authMiddleware } from '../../middleware/index.js';
import catchAsync from '../../utils/catchAsync.js';
import { rateLimiter } from '../../middleware/index.js';

router.post(
  '/',
  rateLimiter.mutationLimiter,
  authMiddleware.authenticate,
  catchAsync(writeKeyController.createWriteKey)
);

router.get(
  '/write-keys',
  rateLimiter.authenticatedLimiter,
  authMiddleware.authenticate,
  catchAsync(writeKeyController.listWriteKeys)
);

router.post(
  '/:writeKeyId/revoke',
  rateLimiter.mutationLimiter,
  authMiddleware.authenticate,
  catchAsync(writeKeyController.revokeWriteKey)
);

export default router;
