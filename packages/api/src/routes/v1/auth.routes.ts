import express, { Router } from 'express';
const router: Router = express.Router();
import { login, refreshAccessToken, logout } from '../../controllers/auth.controller.js';
import catchAsync from '../../utils/catchAsync.js';

router.post('/login', catchAsync(login));

router.post('/refresh', catchAsync(refreshAccessToken));

router.post('/logout', catchAsync(logout));

export default router;
