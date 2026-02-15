import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service';

export async function send(req: Request, res: Response, next: NextFunction) {
  try {
    const { receiverId, subject, body, threadId } = req.body;
    const message = await messageService.sendMessage(
      (req.user as any).id,
      receiverId,
      subject,
      body,
      threadId
    );
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

export async function getThreads(req: Request, res: Response, next: NextFunction) {
  try {
    const threads = await messageService.getThreads((req.user as any).id);
    res.json({ success: true, data: threads });
  } catch (err) {
    next(err);
  }
}

export async function getThread(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await messageService.getThreadMessages(
      req.params.threadId,
      (req.user as any).id
    );
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    await messageService.markAsRead(req.params.id, (req.user as any).id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await messageService.getUnreadCount((req.user as any).id);
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}
