import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    serverTimestamp 
  } from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';
import { increment } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { db } from './firebase';

  export const createChat = async (participants: string[]) => {
    const chatRef = await addDoc(collection(db, 'chats'), {
      participants,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isGroup: false,
      unreadCounts: participants.reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
    });
  
    return chatRef.id;
  };
  
  export const sendMessage = async (chatId: string, senderId: string, text: string) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const chatRef = doc(db, 'chats', chatId);
  
    const batch = writeBatch(db);
    
    // Add new message
    const messageRef = doc(messagesRef);
    batch.set(messageRef, {
      text,
      senderId,
      createdAt: serverTimestamp(),
      isRead: false,
      readBy: [senderId]
    });
    
    // Update chat last message
    batch.update(chatRef, {
      lastMessage: {
        text,
        senderId,
        createdAt: serverTimestamp()
      },
      updatedAt: serverTimestamp(),
      [`unreadCounts.${senderId}`]: 0,
      ...Object.fromEntries(
        Object.keys((await getDoc(chatRef)).data()?.unreadCounts || {})
          .filter(id => id !== senderId)
          .map(id => [`unreadCounts.${id}`, increment(1)])
      )
    });
  
    await batch.commit();
    return messageRef.id;
  };
  
  export const markMessagesAsRead = async (chatId: string, userId: string) => {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      [`unreadCounts.${userId}`]: 0
    });
  };