import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Chat } from '@/libs/types/types';
import { timeAgo } from '@/libs/helpers/helps';
import { auth } from '@/libs/provider/firebase';

interface ChatListItemProps {
  chat: Chat;
}

export default function ChatListItem({ chat }: ChatListItemProps) {
  // In a real app, you'd get the other user's data from your useUser hook
  const otherUser = {
    id: chat.participants.find(id => id !== auth.currentUser?.uid) || '',
    username: 'example_user',
    avatarUrl: 'https://i.imgur.com/0CE7jHL.png'
  };

  return (
    <Link href={`/chat/${chat.id}`} asChild>
      <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
        <Image
          source={{ uri: otherUser.avatarUrl }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold">{otherUser.username}</Text>
            <Text className="text-gray-500 text-xs">
              {/* {timeAgo(chat.lastMessage?.createdAt?.toDate() || new Date())} */}
            </Text>
          </View>
          <Text 
            className="text-gray-500 text-sm"
            numberOfLines={1}
          >
            {chat.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>
        {chat.unreadCounts[auth.currentUser?.uid || ''] > 0 && (
          <View className="bg-blue-500 w-5 h-5 rounded-full items-center justify-center ml-2">
            <Text className="text-black text-xs">
              {chat.unreadCounts[auth.currentUser?.uid || '']}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
}