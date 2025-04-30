import { View, Text, FlatList } from 'react-native';
import { usePosts } from '@/libs/hooks/usePosts';
import Posts from '@/components/layouts/components/post/Post';

export default function HomeScreen() {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading posts: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={posts}
        renderItem={({ item }) => <Posts post={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}