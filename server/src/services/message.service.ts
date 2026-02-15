import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { emailService } from './email.service';

export async function sendMessage(
  senderId: string,
  receiverId: string,
  subject: string,
  body: string,
  threadId?: string
) {
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) throw new AppError('נמען לא נמצא', 404);

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      subject,
      body,
      threadId: threadId || undefined,
    },
  });

  // If first message in thread, set threadId to own ID
  if (!threadId) {
    await prisma.message.update({
      where: { id: message.id },
      data: { threadId: message.id },
    });
  }

  // Send simulated email
  await emailService.sendEmail({
    to: receiver.email,
    subject: `הודעה חדשה: ${subject}`,
    body: 'התקבלה הודעה חדשה. התחבר/י לאתר כדי לצפות בה.',
  });

  return message;
}

export async function getThreads(userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
      threadId: { not: null },
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true } },
      receiver: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Group by threadId and get the last message + unread count
  const threadMap = new Map<string, any>();

  for (const msg of messages) {
    const tid = msg.threadId!;
    if (!threadMap.has(tid)) {
      const participant = msg.senderId === userId ? msg.receiver : msg.sender;
      threadMap.set(tid, {
        threadId: tid,
        subject: msg.subject,
        lastMessage: msg,
        unreadCount: 0,
        participantName: `${participant.firstName} ${participant.lastName}`,
      });
    }
    if (msg.receiverId === userId && !msg.isRead) {
      const thread = threadMap.get(tid);
      thread.unreadCount++;
    }
  }

  return Array.from(threadMap.values());
}

export async function getThreadMessages(threadId: string, userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      threadId,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true } },
      receiver: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (messages.length === 0) throw new AppError('שיחה לא נמצאה', 404);
  return messages;
}

export async function markAsRead(messageId: string, userId: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new AppError('הודעה לא נמצאה', 404);
  if (message.receiverId !== userId) throw new AppError('אין הרשאה', 403);

  return prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.message.count({
    where: { receiverId: userId, isRead: false },
  });
}
