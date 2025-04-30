import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Notification } from '@/libs/types/types';
import { timeAgo } from '@/libs/helpers/helps';

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  // In a real app, you'd get the sender's data from your useUser hook
  const sender = {
    id: notification.senderId,
    username: 'example_user',
    avatarUrl: 'https://i.imgur.com/0CE7jHL.png'
  };

  const getNotificationText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a post';
      default:
        return 'sent you a notification';
    }
  };

  return (
    <Link 
      href={
        notification.postId ? `/post/${notification.postId}` : 
        notification.chatId ? `/chat/${notification.chatId}` : 
        `/profile/${sender.id}`
      } 
      asChild
    >
      <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
        <Image
          source={{ uri: sender.avatarUrl }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text>
            <Text className="font-bold">{sender.username}</Text> {getNotificationText()}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            {timeAgo(notification.createdAt.toDate())}
          </Text>
        </View>
        {!notification.isRead && (
          <View className="w-2 h-2 rounded-full bg-blue-500" />
        )}
      </TouchableOpacity>
    </Link>
  );
}