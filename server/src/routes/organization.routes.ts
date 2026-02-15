import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { organizationSchema } from '@volunteer/shared';
import * as orgController from '../controllers/organization.controller';

const router = Router();

router.post('/', requireRole('ORGANIZATION'), validate(organizationSchema), orgController.create);
router.get('/mine', requireRole('ORGANIZATION'), orgController.getMine);
router.get('/:id', requireAuth, orgController.getById);
router.put('/:id', requireRole('ORGANIZATION'), orgController.update);

export default router;
