import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { activitySchema } from '@volunteer/shared';
import * as activityController from '../controllers/activity.controller';

const router = Router();

router.post('/', requireRole('ORGANIZATION'), validate(activitySchema), activityController.create);
router.get('/', requireAuth, activityController.getAll);
router.get('/calendar', requireAuth, activityController.getCalendar);
router.get('/:id', requireAuth, activityController.getById);
router.put('/:id', requireRole('ORGANIZATION'), activityController.update);
router.delete('/:id', requireRole('ORGANIZATION'), activityController.deactivate);
router.get('/:id/registrants', requireRole('ORGANIZATION'), activityController.getRegistrants);

export default router;
