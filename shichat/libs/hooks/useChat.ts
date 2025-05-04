// useChat.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  getDoc, 
  doc,
  updateDoc,
  where,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../provider/firebase';
import { Message, Chat } from '../types/types';
import { arrayUnion } from 'firebase/firestore';

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    // Load chat metadata
    const chatRef = doc(db, 'chats', chatId);
    const unsubscribeChat = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setChat({
          id: doc.id,
          participants: data.participants,
          participantData: data.participantData || {},
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
        });
      }
    });

    // Load messages
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribeMessages = onSnapshot(
      q,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            senderId: data.senderId,
            createdAt: data.createdAt?.toDate(),
            isRead: data.isRead,
            readBy: data.readBy || [],
          } as Message;
        });
        setMessages(messagesData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !auth.currentUser?.uid || !chatId) {
      throw new Error('Missing required fields to send message');
    }

    try {
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      // Verify user is a participant
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists() || !chatSnap.data()?.participants.includes(auth.currentUser.uid)) {
        throw new Error("Not authorized to send messages in this chat");
      }

      // Add message
      const messageRef = await addDoc(messagesRef, {
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

      return messageRef;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      throw err;
    }
  };

  const markMessagesAsRead = async () => {
    try {
      if (!auth.currentUser?.uid || !chatId) return;

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
    messages, 
    chat, 
    loading, 
    error, 
    sendMessage, 
    markMessagesAsRead 
  };
};