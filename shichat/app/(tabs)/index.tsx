import { View, Text, FlatList } from 'react-native';
import { usePosts } from '@/libs/hooks/usePosts';
import Post from '@/components/layouts/components/post/Post'; // Renamed import to avoid confusion

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
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Text>No posts available</Text>
          </View>
        }
        contentContainerStyle={{ 
          paddingBottom: 20,
          flexGrow: 1 // Ensures proper scrolling when few items
        }}
      />
      {/* {posts.map((post) => (
        <View key={post.id} className="mb-6">
          <Text>{post.id}</Text>
          <Text>{post.createdAt.toString()}</Text>
          <Text>{post.caption}</Text>
          </View>
      ))} */}
    </View>
  );
}