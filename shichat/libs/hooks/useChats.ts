import { useState, useEffect } from 'react';
import { addDoc, writeBatch, getDocs } from 'firebase/firestore';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from '../provider/firebase';
import { User } from '../types/types';
import { Timestamp } from 'firebase/firestore';

type orderProp = {
  id: string,
  otherUser: {
    id: string,
    username: string,
    avatarUrl: string,
  },
  lastMessage: string | null,
  createdAt: string
  updatedAt: string
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: Timestamp | Date;
  };
  unreadCounts: Record<string, number>;
  updatedAt: Timestamp | Date;
  isGroup: boolean;
  groupInfo?: {
    name: string;
    adminIds: string[];
    avatarUrl: string;
  };
  createdAt?: Date;
  otherUser?: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const chatsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const chatData = doc.data() as DocumentData;
              // Get the other participant's data
              const otherUserId = chatData.participants.find(
                (id: string) => id !== auth.currentUser?.uid
              );

              
              let userData: Partial<User> = {};
              if (otherUserId) {
                const userDoc = await getDoc(doc(db, 'users', otherUserId));
                userData = userDoc.data() as User;
              }

              return {
                id: doc.id,
                ...chatData,
                otherUser: {
                  id: otherUserId,
                  username: userData?.username || '',
                  avatarUrl: userData?.avatarUrl || '',
                },
                lastMessage: chatData.lastMessage?.text ? {
                  text: chatData.lastMessage.text,
                  senderId: chatData.lastMessage.senderId,
                  createdAt: chatData.lastMessage.createdAt?.toDate?.() || null,
                } : null,
                createdAt: chatData.createdAt?.toDate?.() || null,
                updatedAt: chatData.updatedAt?.toDate?.() || null,
              } as Chat;
            })
          );
          setChats(chatsData.filter(chat => chat.createdAt)); // Filter out invalid chats
          setLoading(false);
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const createChat = async (participantIds: string[]) => {
    try {
      if (!auth.currentUser?.uid) return null;

      const participants = [...participantIds, auth.currentUser.uid];
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants,
        lastMessage: null,
        unreadCounts: {
          [auth.currentUser.uid]: 0,
          ...participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
        },
        isGroup: participantIds.length > 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return chatRef.id;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const sendMessage = async (chatId: string, text: string) => {
    try {
      if (!auth.currentUser?.uid) return;

      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const chatRef = doc(db, 'chats', chatId);

      // Add new message
      await addDoc(messagesRef, {
        text,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isRead: false,
        readBy: [auth.currentUser.uid],
      });

      // Update chat last message and unread counts
      await updateDoc(chatRef, {
        lastMessage: {
          text,
          senderId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
        [`unreadCounts.${auth.currentUser.uid}`]: 0,
      });
    } catch (err) {
      setError(err as Error);
    }
  };

  const markAsRead = async (chatId: string) => {
    try {
      if (!auth.currentUser?.uid) return;

      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        [`unreadCounts.${auth.currentUser.uid}`]: 0,
      });

      // Optionally mark all messages as read
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(
        messagesRef,
        where('isRead', '==', false),
        where('senderId', '!=', auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          isRead: true,
          readBy: arrayUnion(auth.currentUser?.uid),
        });
      });
      await batch.commit();
    } catch (err) {
      setError(err as Error);
    }
  };

  return { 
    chats, 
    loading, 
    error, 
    createChat, 
    sendMessage, 
    markAsRead 
  };
};