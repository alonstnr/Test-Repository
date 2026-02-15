import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { messageSchema } from '@volunteer/shared';
import * as messageController from '../controllers/message.controller';

const router = Router();

router.post('/', requireAuth, validate(messageSchema), messageController.send);
router.get('/threads', requireAuth, messageController.getThreads);
router.get('/threads/:threadId', requireAuth, messageController.getThread);
router.put('/:id/read', requireAuth, messageController.markRead);
router.get('/unread-count', requireAuth, messageController.getUnreadCount);

export default router;
