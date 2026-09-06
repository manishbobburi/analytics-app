import express, { Router } from 'express';
const router: Router = express.Router();
import { login, refreshAccessToken, logout } from '../../controllers/auth.controller.js';
import { rateLimiter } from '../../middleware/index.js';
import catchAsync from '../../utils/catchAsync.js';

router.post('/login', rateLimiter.loginLimiter, catchAsync(login));

router.post('/refresh', rateLimiter.authenticatedLimiter, catchAsync(refreshAccessToken));

router.post('/logout', catchAsync(logout));

export default router;
