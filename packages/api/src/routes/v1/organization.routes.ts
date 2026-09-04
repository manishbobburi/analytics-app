import express, { Router } from 'express';
const router: Router = express.Router();

import { organizationController } from '../../controllers/index.js';
import catchAsync from '../../utils/catchAsync.js';

router.post('/create-organization', catchAsync(organizationController.createOrganization));

export default router;
