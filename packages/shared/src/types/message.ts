export interface Message {
  id: string;
  subject: string;
  body: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  threadId?: string;
  parentId?: string;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface MessageThread {
  threadId: string;
  subject: string;
  lastMessage: Message;
  unreadCount: number;
  participantName: string;
}
