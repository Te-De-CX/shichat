import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '@/libs/types/types';
import { Link } from 'expo-router';
import { auth } from '@/libs/provider/firebase';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const isCurrentUser = user.uid === auth.currentUser?.uid;
  
  // Function to generate chat ID between two users
  const getChatId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join('_');
  };

  return (
    <View className="p-4">
      {/* ... other profile header content ... */}
      <View className="flex-row items-center justify-between">
        <Image
          source={{ uri: user.avatarUrl || 'https://i.imgur.com/0CE7jHL.png' }}
          className="w-20 h-20 rounded-full"
        />
        
        <View className="flex-row space-x-4">
          <View className="items-center">
            <Text>{user.username}</Text>
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
      {!isCurrentUser && (
        <View className="flex-row mt-3 space-x-2">
          <TouchableOpacity className="flex-1 bg-blue-500 p-1 rounded">
            <Text className="text-white text-center">Follow</Text>
          </TouchableOpacity>
          <Link 
            href={{
              pathname: "/chat/[id]",
              params: { id: getChatId(auth.currentUser?.uid || '', user.uid) }
            }} 
            className="flex-1 border border-gray-300 p-1 rounded"
          >
            <Text className="text-center">Message</Text>
          </Link>
        </View>
      )}
    </View>
  );
}