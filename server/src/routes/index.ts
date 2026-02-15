import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import organizationRoutes from './organization.routes';
import activityRoutes from './activity.routes';
import registrationRoutes from './registration.routes';
import messageRoutes from './message.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/activities', activityRoutes);
router.use('/registrations', registrationRoutes);
router.use('/messages', messageRoutes);

export default router;
