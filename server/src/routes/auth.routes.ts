import { Router } from 'express';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '@volunteer/shared';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

export default router;
