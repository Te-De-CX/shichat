import { Timestamp } from 'firebase/firestore';

export type Notification = {
  id: string;
  recipientId: string;
  senderId: string;
  title: string;
  message: string;
  type: 'message' | 'like' | 'comment' | 'follow';
  isRead: boolean;
  createdAt: Timestamp | Date;
  relatedItemId?: string;
  data?: Record<string, any>;
};