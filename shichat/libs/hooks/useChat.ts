import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { Message } from '../types/types';
import { auth, db } from '../provider/firebase'; 

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messagesData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: auth.currentUser?.uid,
        createdAt: new Date(),
        isRead: false,
        readBy: [],
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return { messages, loading, error, sendMessage };
};