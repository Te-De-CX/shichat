import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { usePostComments } from '@/libs/hooks/usePostComments';
import Comment from './Comment';

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { comments, loading, error } = usePostComments(postId);

  return (
    <View className="px-4 py-2 border-t border-gray-200">
      <Text className="font-bold mb-2">Comments</Text>
      
      {loading ? (
        <Text>Loading comments...</Text>
      ) : error ? (
        <Text>Error loading comments</Text>
      ) : comments.length > 0 ? (
        <FlatList
          data={comments.slice(0, 3)}
          renderItem={({ item }) => <Comment comment={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text className="text-gray-500">No comments yet</Text>
      )}
      
      <TouchableOpacity className="mt-2">
        <Text className="text-blue-500">View all comments</Text>
      </TouchableOpacity>
    </View>
  );
}