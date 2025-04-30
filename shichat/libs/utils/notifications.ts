import { doc, setDoc } from 'firebase/firestore';
import { db } from '../provider/firebase';
import { getMessaging, getToken } from 'firebase/messaging';

export const sendNotification = async (
  recipientId: string,
  senderId: string,
  type: 'like' | 'comment' | 'follow' | 'mention',
  postId?: string,
  commentId?: string
) => {
  await setDoc(doc(db, 'notifications'), {
    recipientId,
    senderId,
    type,
    postId,
    commentId,
    isRead: false,
    createdAt: new Date()
  });
};

export const requestNotificationPermission = async () => {
  const messaging = getMessaging();
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });
    return token;
  } catch (err) {
    console.error('Error getting notification token:', err);
    return null;
  }
};