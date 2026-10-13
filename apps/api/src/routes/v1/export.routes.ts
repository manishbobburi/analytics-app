import { Router } from 'express';

import { exportController } from '../../controllers/index.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router: Router = Router();

router.post('/events', authenticate, exportController.exportEvents);

export default router;
