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
  setDoc
} from 'firebase/firestore';
import { Message } from '../types/types';
import { auth, db } from '../provider/firebase';

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
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
            readBy: data.readBy || []
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

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !auth.currentUser?.uid || !chatId) {
      throw new Error('Missing required fields to send message');
    }

    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        throw new Error("Chat doesn't exist");
      }
      
      const participants = chatSnap.data()?.participants || [];
      if (!participants.includes(auth.currentUser.uid)) {
        throw new Error("Not a chat participant");
      }

      const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isRead: false,
        readBy: [auth.currentUser.uid]
      });

      // Update lastUpdated timestamp
      await setDoc(chatRef, {
        lastUpdated: serverTimestamp()
      }, { merge: true });

      return messageRef;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
};