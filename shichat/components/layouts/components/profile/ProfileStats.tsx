import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  userId: string;
}

export default function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
  userId
}: ProfileStatsProps) {
  return (
    <View className="flex-row justify-around py-4 border-t border-b border-gray-200">
      <Link href={`/profile/${userId}/posts`} asChild>
        <TouchableOpacity className="items-center">
          <Text className="font-bold">{postsCount}</Text>
          <Text>Posts</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href={`/profile/${userId}/followers`} asChild>
        <TouchableOpacity className="items-center">
          <Text className="font-bold">{followersCount}</Text>
          <Text>Followers</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href={`/profile/${userId}/following`} asChild>
        <TouchableOpacity className="items-center">
          <Text className="font-bold">{followingCount}</Text>
          <Text>Following</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}