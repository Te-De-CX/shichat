import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { timeAgo } from '@/libs/helpers/helps';
import { Timestamp } from 'firebase/firestore';

interface PostHeaderProps {
  authorId: string;
  createdAt: Date | Timestamp;
}

export default function PostHeader({ authorId, createdAt }: PostHeaderProps) {
  // Convert Firestore Timestamp to Date if needed
  const postDate = createdAt instanceof Timestamp 
    ? createdAt.toDate() 
    : createdAt;

  const author = {
    id: authorId,
    username: 'example_user',
    avatarUrl: 'https://i.imgur.com/0CE7jHL.png',
  };

  return (
    <View className="flex-row items-center justify-between p-3">
      <Link href={`/profile/${authorId}`} asChild>
        <TouchableOpacity className="flex-row items-center space-x-2">
          <Image
            source={{ uri: author.avatarUrl }}
            className="w-8 h-8 rounded-full"
          />
          <Text className="font-bold">{author.username}</Text>
        </TouchableOpacity>
      </Link>
      
      <View className="flex-row items-center space-x-3">
        <Text className="text-gray-500 text-sm">
          {timeAgo(postDate)}
        </Text>
        <TouchableOpacity>
          <Text className="font-bold">···</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}