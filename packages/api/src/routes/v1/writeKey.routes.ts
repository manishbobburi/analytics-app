import express, { Router } from 'express';
const router: Router = express.Router();

import { writeKeyController } from '../../controllers/index.js';
import { authMiddleware } from '../../middleware/index.js';
import catchAsync from '../../utils/catchAsync.js';

router.post('/', authMiddleware.authenticate, catchAsync(writeKeyController.createWriteKey));

router.get(
  '/write-keys',
  authMiddleware.authenticate,
  catchAsync(writeKeyController.listWriteKeys)
);

router.post(
  '/:writeKeyId/revoke',
  authMiddleware.authenticate,
  catchAsync(writeKeyController.revokeWriteKey)
);

export default router;
