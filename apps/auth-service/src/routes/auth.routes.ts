import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, qrVerifySchema, mfaVerifySchema, refreshTokenSchema } from '../types/auth.schemas';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/qr-verify', validateRequest(qrVerifySchema), authController.qrVerify);
router.post('/verify-mfa', validateRequest(mfaVerifySchema), authController.verifyMfa);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);
router.get('/user', authenticate, authController.getUser);
router.post('/logout', authenticate, authController.logout);

export default router;
