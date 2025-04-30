import { View, Text, FlatList, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePostComments } from '@/libs/hooks/usePostComments';
import Comment from '@/components/layouts/components/post/Comment';
import { useState } from 'react';

export default function CommentsScreen() {
  const { id } = useLocalSearchParams();
  const { comments, loading, error, addComment } = usePostComments(id as string);
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    await addComment(commentText);
    setCommentText('');
  };

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <Text className="text-center mt-8">Loading comments...</Text>
      ) : error ? (
        <Text className="text-center mt-8 text-red-500">
          Error: {error.message}
        </Text>
      ) : (
        <FlatList
          data={comments}
          renderItem={({ item }) => <Comment comment={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text className="text-center mt-8 text-gray-500">
              No comments yet
            </Text>
          }
        />
      )}
      
      <View className="border-t border-gray-200 p-4">
        <TextInput
          placeholder="Add a comment..."
          className="border border-gray-200 p-3 rounded-lg"
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </View>
  );
}