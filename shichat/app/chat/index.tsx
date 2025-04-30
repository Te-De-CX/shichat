import { View, Text, FlatList } from 'react-native';
import ChatListItem from '@/components/layouts/components/chat/ChatListItem';
import { useChats } from '@/libs/hooks/useChats';

export default function ChatListScreen() {
  const { chats, loading, error } = useChats();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading chats: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatListItem chat={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}