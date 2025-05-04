import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Post } from '@/libs/types/types';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import { useLikePost } from '@/libs/hooks/useLikePost';

interface PostProps {
  post: Post;
  onCommentPress?: () => void;
  onSharePress?: () => void;
}

export default function Posts({ post, onCommentPress, onSharePress }: PostProps) {
  const { toggleLike, isLiked, isLoading } = useLikePost(post.id, post.likesCount);

  const handleLike = () => {
    toggleLike();
  };

  const handleComment = () => {
    onCommentPress?.();
  };

  const handleShare = () => {
    onSharePress?.();
  };

  const handleSave = () => {
    // Implement save functionality here
    console.log('Save post', post.id);
  };

  return (
    <View className="mb-6 bg-white">
      <PostHeader authorId={post.authorId} createdAt={post.createdAt} />
      
      <PostActions 
        postId={post.id}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
      />
      
      <View className="px-4 py-2">
        <Text className="font-bold">{post.likesCount} likes</Text>
        <View className="mt-1">
          <Text className="font-bold">{post.caption}</Text> 
        </View>
        {post.commentsCount > 0 && (
          <TouchableOpacity onPress={handleComment}>
            <Text className="text-gray-500 mt-1">
              View all {post.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text className="text-gray-400 text-xs mt-1">
          {post.createdAt.toString()}
        </Text>
      </View>
    </View>
  );
}