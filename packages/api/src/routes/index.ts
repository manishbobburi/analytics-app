import express, { Router } from 'express';
const router: Router = express.Router();

import v1Router from './v1/index.js';

router.use('/v1', v1Router);

export default router;
