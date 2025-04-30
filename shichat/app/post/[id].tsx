import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PostActions from '@/components/layouts/components/post/PostActions';
import PostHeader from '@/components/layouts/components/post/PostHeader';
import { usePost } from '@/libs/hooks/usePost';
import CommentList from '@/components/layouts/components/post/CommentList';
export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const { post, loading, error } = usePost(id as string);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading post...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading post</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <PostHeader authorId={post.authorId} createdAt={post.createdAt} />
      
      
      <PostActions 
        postId={post.id}
        isLiked={false} // You would get this from your hook
        onLike={() => {}}
        onComment={() => {}}
        onShare={() => {}}
        onSave={() => {}}
      />
      
      <View className="px-4 py-2">
        <Text className="font-bold">{post.likesCount} likes</Text>
        <Text className="mt-1">
          <Text className="font-bold">{post.authorId}</Text> {post.caption}
        </Text>
        <Text className="text-gray-400 text-xs mt-1">
          {post.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
      
      <CommentList postId={post.id} />
    </ScrollView>
  );
}