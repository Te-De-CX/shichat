import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/libs/services/AuthProvider';
import { useUserPosts } from '@/libs/hooks/useUserPosts';
import ProfileHeader from '@/components/layouts/components/profile/ProfileHeader';
import Posts from '@/components/layouts/components/post/Post';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { posts, loading, error } = useUserPosts(user?.uid || '');

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ProfileHeader user={user} isCurrentUser />
      
      <View className="flex-row border-t border-b border-gray-200 py-2 my-2">
        <Link href="/profile/edit" asChild>
          <TouchableOpacity className="flex-1 items-center">
            <Text className="font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/profile/settings" asChild>
          <TouchableOpacity className="flex-1 items-center">
            <Text className="font-bold">Settings</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      {loading ? (
        <Text className="text-center mt-8">Loading posts...</Text>
      ) : error ? (
        <Text className="text-center mt-8 text-red-500">
          Error: {error.message}
        </Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Posts post={item} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{ gap: 2 }}
          contentContainerStyle={{ gap: 2 }}
          ListEmptyComponent={
            <Text className="text-center mt-8 text-gray-500">
              No posts yet
            </Text>
          }
        />
      )}
    </View>
  );
}