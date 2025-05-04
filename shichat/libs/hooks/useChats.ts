// useChats.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../provider/firebase';
import { Chat, User } from '../types/types';

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      setLoading(false);
      return;
    }

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
              const data = doc.data();
              const otherUserId = data.participants.find(
                (id: string) => id !== auth.currentUser?.uid
              );

              let otherUser: User | undefined;
              if (otherUserId && !data.isGroup) {
                const userDoc = await getDoc(doc(db, 'users', otherUserId));
                otherUser = userDoc.data() as User;
              }

              return {
                id: doc.id,
                participants: data.participants,
                lastMessage: data.lastMessage
                  ? {
                      text: data.lastMessage.text,
                      senderId: data.lastMessage.senderId,
                      createdAt: data.lastMessage.createdAt?.toDate(),
                    }
                  : undefined,
                unreadCounts: data.unreadCounts || {},
                updatedAt: data.updatedAt?.toDate(),
                isGroup: data.isGroup || false,
                groupInfo: data.groupInfo,
                createdAt: data.createdAt?.toDate(),
                otherUser,
                participantData: data.participantData || {},
              } as Chat;
            })
          );
          setChats(chatsData);
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

  const createChat = async (participantIds: string[], isGroup = false, groupInfo?: any) => {
    try {
      if (!auth.currentUser?.uid) return null;

      const participants = [...new Set([...participantIds, auth.currentUser.uid])];
      
      // Check if chat already exists (for 1:1 chats)
      if (!isGroup && participants.length === 2) {
        const existingChatQuery = query(
          collection(db, 'chats'),
          where('participants', '==', participants),
          where('isGroup', '==', false)
        );
        
        const existingChats = await getDocs(existingChatQuery);
        if (!existingChats.empty) {
          return existingChats.docs[0].id;
        }
      }

      const chatData: any = {
        participants,
        lastMessage: null,
        unreadCounts: participants.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
        isGroup,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (isGroup && groupInfo) {
        chatData.groupInfo = groupInfo;
      }

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      return chatRef.id;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const sendMessage = async (chatId: string, text: string) => {
    try {
      if (!auth.currentUser?.uid || !text.trim()) return;

      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      // Add message
      await addDoc(messagesRef, {
        text,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isRead: false,
        readBy: [auth.currentUser.uid],
      });

      // Update chat metadata
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
      throw err;
    }
  };

  const markAsRead = async (chatId: string) => {
    try {
      if (!auth.currentUser?.uid) return;

      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      // Update chat unread count
      await updateDoc(chatRef, {
        [`unreadCounts.${auth.currentUser.uid}`]: 0,
      });

      // Mark all unread messages as read
      const unreadMessagesQuery = query(
        messagesRef,
        where('isRead', '==', false),
        where('senderId', '!=', auth.currentUser.uid)
      );

      const snapshot = await getDocs(unreadMessagesQuery);
      const batch = writeBatch(db);
      snapshot.docs.forEach((messageDoc) => {
        batch.update(messageDoc.ref, {
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