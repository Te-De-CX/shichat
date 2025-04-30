import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { User } from '@/libs/types/types';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/profile/${user.id}`} asChild>
      <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
        <Image
          source={{ uri: user.avatarUrl || 'https://i.imgur.com/0CE7jHL.png' }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-bold">{user.username}</Text>
          <Text className="text-gray-500">{user.fullName}</Text>
        </View>
        <TouchableOpacity className="border border-gray-300 px-3 py-1 rounded">
          <Text className="font-bold">Follow</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  );
}