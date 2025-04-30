import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useCreatePost } from '@/libs/hooks/useCreatePosts';
import { TextInput } from 'react-native-gesture-handler';
import Button from '@/components/layouts/UI/Button';

export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const { createPost, loading } = useCreatePost();

  const pickImage = async () => {
  const handleSubmit = async () => {
    if (!caption.trim() || images.length === 0) return;
    await createPost(caption, images);
    setCaption('');
    setImages([]);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Create New Post</Text>
      
      <TextInput
        placeholder="Write a caption..."
        className="border border-gray-200 p-3 rounded-lg mb-4"
        multiline
        value={caption}
        onChangeText={setCaption}
      />
      
      <TouchableOpacity 
        onPress={pickImage}
        className="bg-gray-100 p-8 items-center justify-center rounded-lg mb-4"
      >
        {images.length > 0 ? (
          <Image 
            source={{ uri: images[0] }} 
            className="w-full h-64 rounded-lg"
          />
        ) : (
          <Text className="text-gray-500">Select Photos</Text>
        )}
      </TouchableOpacity>
      
      {images.length > 0 && (
        <Text className="text-gray-500 mb-4">
          {images.length} photo{images.length > 1 ? 's' : ''} selected
        </Text>
      )}
      
      <Button 
        title="Post" 
        onPress={handleSubmit} 
        loading={loading}
        disabled={loading || !caption.trim() || images.length === 0}
      />
    </View>
  );

}
}
