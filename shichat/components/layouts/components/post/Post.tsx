import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Post } from '@/libs/types/types';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

interface PostProps {
  post: Post;
}

export default function Posts({ post }: PostProps) {
  return (
    <View className="mb-6 bg-white">
      <PostHeader authorId={post.authorId} createdAt={post.createdAt} />
      
      <PostActions postId={post.id} />
      
      <View className="px-4 py-2">
        <Text className="font-bold">{post.likesCount} likes</Text>
        <Text className="mt-1">
          <Text className="font-bold">{post.author.username}</Text> {post.caption}
        </Text>
        {post.commentsCount > 0 && (
          <TouchableOpacity>
            <Text className="text-gray-500 mt-1">
              View all {post.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text className="text-gray-400 text-xs mt-1">
          {post.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}