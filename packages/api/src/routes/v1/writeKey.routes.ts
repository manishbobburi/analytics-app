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

export default router;
