import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/libs/services/AuthProvider';
import { useUserPosts } from '@/libs/hooks/useUserPosts';
import { useCurrentUserData } from '@/libs/hooks/useCurrentUserData';
import ProfileHeader from '@/components/layouts/components/profile/ProfileHeader';
import Post from '@/components/layouts/components/post/Post';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { currentUser, loading: userLoading, error: userError } = useCurrentUserData();
  const { posts, loading: postsLoading, error: postsError } = useUserPosts(user?.uid || '');

  if (!user) {
    return (
      <SafeAreaView className="flex-1 pt-32 items-center justify-center">
        <Text>Please log in to view your profile</Text>
        <Link href="/auth/login" asChild>
          <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded">
            <Text className="text-blue-800">Go to Login</Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    );
  }

  if (userLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (userError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error loading profile: {userError.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-32">
      {currentUser && <ProfileHeader user={currentUser} />}
      
      {/* Profile Actions */}
      <View className="flex-row border-t border-b border-gray-200 py-2 my-2">
        <Link href={"/chat"} >
          <Text>See Chats</Text>
        </Link>
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

      {/* Posts Grid */}
      {postsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : postsError ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500 mb-2">Error loading posts</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{ gap: 1 }}
          contentContainerStyle={{ gap: 1, paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-8">
              <Text className="text-gray-500 mb-4">No posts yet</Text>
              <Link href="/(tabs)/create" asChild>
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
                  <Text className="text-white">Create your first post</Text>
                </TouchableOpacity>
              </Link>
            </View>
          }
        />
      )}
    </View>
  );
}