import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registrationSchema } from '@volunteer/shared';
import * as registrationController from '../controllers/registration.controller';

const router = Router();

router.post('/', requireAuth, validate(registrationSchema), registrationController.register);
router.get('/mine', requireAuth, registrationController.getMine);
router.delete('/:id', requireAuth, registrationController.cancel);

export default router;
