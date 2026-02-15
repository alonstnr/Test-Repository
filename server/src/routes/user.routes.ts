import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { volunteerProfileSchema } from '@volunteer/shared';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, userController.updateProfile);
router.get('/volunteer-profile', requireAuth, userController.getVolunteerProfile);
router.put('/volunteer-profile', requireAuth, validate(volunteerProfileSchema), userController.upsertVolunteerProfile);

export default router;
