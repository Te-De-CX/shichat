import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const createNotification = async (
  recipientId: string,
  senderId: string,
  type: 'like' | 'comment' | 'follow' | 'mention',
  postId?: string,
  commentId?: string,
  chatId?: string,
) => {
  await addDoc(collection(db, 'notifications'), {
    recipientId,
    senderId,
    type,
    postId,
    commentId,
    chatId,
    isRead: false,
    createdAt: new Date()
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    isRead: true
  });
};