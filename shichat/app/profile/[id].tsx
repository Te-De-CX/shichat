import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/libs/hooks/useUser';
import { useUserPosts } from '@/libs/hooks/useUserPosts';
import ProfileHeader from '@/components/layouts/components/profile/ProfileHeader';
import Post from '@/components/layouts/components/post/Post';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { user, loading: userLoading, error: userError } = useUser(id as string);
  const { posts, loading: postsLoading, error: postsError } = useUserPosts(id as string);

  if (userLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (userError || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading profile</Text>
      </View>
    );
  }

  return (    
    <SafeAreaView className="flex-1 pt-20 bg-white">
      <ProfileHeader user={user} />
      
      {postsLoading ? (
        <Text className="text-center mt-8">Loading posts...</Text>
      ) : postsError ? (
        <Text className="text-center mt-8 text-red-500">
          Error: {postsError.message}
        </Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
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
   </SafeAreaView>
  )}