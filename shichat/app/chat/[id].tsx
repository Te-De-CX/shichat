import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChat } from '@/libs/hooks/useChat';
import { FlatList } from 'react-native-gesture-handler';
import ChatInput from '@/components/layouts/components/chat/ChatInput';
import ChatBubble from '@/components/layouts/components/chat/ChatBubble';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, sendMessage } = useChat(id);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 p-4">
        <FlatList
          data={messages}
          renderItem={({ item }) => <ChatBubble message={item} />}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{ paddingTop: 20 }}
        />
        <ChatInput onSend={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}