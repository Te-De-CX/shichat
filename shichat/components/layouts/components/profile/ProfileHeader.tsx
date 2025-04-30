import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '@/libs/types/types';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

export default function ProfileHeader({ user, isCurrentUser }: ProfileHeaderProps) {
  return (
    <View className="p-4">
      <View className="flex-row items-center justify-between">
        <Image
          source={{ uri: user.avatarUrl || 'https://i.imgur.com/0CE7jHL.png' }}
          className="w-20 h-20 rounded-full"
        />
        
        <View className="flex-row space-x-4">
          <View className="items-center">
            <Text className="font-bold">{user.postsCount}</Text>
            <Text>Posts</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold">{user.followersCount}</Text>
            <Text>Followers</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold">{user.followingCount}</Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>
      
      <View className="mt-3">
        <Text className="font-bold">{user.fullName}</Text>
        <Text className="text-gray-500">{user.bio}</Text>
        {user.website && (
          <Text className="text-blue-500">{user.website}</Text>
        )}
      </View>
      
      {isCurrentUser ? (
        <TouchableOpacity className="mt-3 border border-gray-300 p-1 rounded">
          <Text className="text-center font-bold">Edit Profile</Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row mt-3 space-x-2">
          <TouchableOpacity className="flex-1 bg-blue-500 p-1 rounded">
            <Text className="text-white text-center">Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-gray-300 p-1 rounded">
            <Text className="text-center">Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}