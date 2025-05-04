import { View, KeyboardAvoidingView, Platform, FlatList, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChat } from '@/libs/hooks/useChat';
import ChatInput from '@/components/layouts/components/chat/ChatInput';
import ChatBubble from '@/components/layouts/components/chat/ChatBubble';
import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/libs/provider/firebase';
import { serverTimestamp } from 'firebase/firestore';
import { Alert } from 'react-native';
import { useCurrentUserData } from '@/libs/hooks/useCurrentUserData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, sendMessage, loading, error } = useChat(id as string);
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { currentUser } = useCurrentUserData();

  useEffect(() => {
    const initializeChat = async () => {
      if (!id || !auth.currentUser?.uid) {
        setInitError('Missing chat ID or user not authenticated');
        setInitializing(false);
        return;
      }
      
      try {
        const chatRef = doc(db, 'chats', id as string);
        const chatSnap = await getDoc(chatRef);
        
        if (!chatSnap.exists()) {
          const participants = (id as string).split('_');
          
          if (participants.length !== 2) {
            throw new Error('Invalid chat ID format');
          }
          
          if (!participants.includes(auth.currentUser.uid)) {
            throw new Error('User not authorized to create this chat');
          }

          // Verify both users exist
          const [user1, user2] = await Promise.all([
            getDoc(doc(db, 'users', participants[0])),
            getDoc(doc(db, 'users', participants[1]))
          ]);

          if (!user1.exists() || !user2.exists()) {
            throw new Error('One or both users do not exist');
          }

          await setDoc(chatRef, {
            participants,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            participantData: {
              [participants[0]]: user1.data()?.username || 'User 1',
              [participants[1]]: user2.data()?.username || 'User 2'
            }
          });
        }
        setInitializing(false);
      } catch (err) {
        console.error('Error initializing chat:', err);
        setInitError(err.message || 'Failed to initialize chat');
        setInitializing(false);
      }
    };

    initializeChat();
  }, [id]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send message");
    }
  };

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (initError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{initError}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">Error: {error.message}</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={messages}
              renderItem={({ item }) => (
                <ChatBubble 
                  message={item} 
                  isCurrentUser={item.senderId === auth.currentUser?.uid}
                />
              )}
              keyExtractor={(item) => item.id}
              inverted
              contentContainerStyle={{ paddingVertical: 16 }}
              showsVerticalScrollIndicator={false}
            />
            <ChatInput onSend={handleSendMessage} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}