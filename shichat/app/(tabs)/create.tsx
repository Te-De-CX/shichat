import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useCreatePost } from '@/libs/hooks/useCreatePosts';
import Button from '@/components/layouts/UI/Button';

export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const { createPost, loading } = useCreatePost();

  const handleSubmit = async () => {
    if (!caption.trim()) return;
    await createPost(caption); 
    setCaption('');
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Create New Post</Text>
      
      <TextInput
        placeholder="What's on your mind?"
        className="border border-gray-200 p-3 rounded-lg mb-4"
        multiline
        numberOfLines={4}
        value={caption}
        onChangeText={setCaption}
      />
      
      <Button 
        title="Post" 
        onPress={handleSubmit} 
        loading={loading}
        disabled={loading || !caption.trim()}
      />
    </View>
  );
}