import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useStatus } from '@/libs/hooks/useStatus';
import { router } from 'expo-router';

const COLORS = [
  '#000000', '#1E3A8A', '#065F46', '#991B1B', '#9A3412',
  '#701A75', '#1E40AF', '#0D9488', '#B45309', '#86198F'
];

const TEXT_COLORS = ['#FFFFFF', '#F3F4F6', '#E5E7EB'];

export default function CreateStatusScreen() {
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const { createTextStatus, loading } = useStatus();

  const handlePost = async () => {
    if (!text.trim()) return;
    await createTextStatus(text, bgColor, textColor);
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Preview */}
      <View 
        className="h-64 items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Text 
          className="text-2xl p-4 text-center"
          style={{ color: textColor }}
        >
          {text || 'Your status preview'}
        </Text>
      </View>

      {/* Text input */}
      <TextInput
        placeholder="Type your status here..."
        className="bg-white p-4 border-t border-b border-gray-200"
        value={text}
        onChangeText={setText}
        multiline
      />

      {/* Color selection */}
      <ScrollView horizontal className="bg-white p-4">
        <View className="flex-row space-x-2">
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              className={`w-10 h-10 rounded-full ${bgColor === color ? 'border-2 border-blue-500' : ''}`}
              style={{ backgroundColor: color }}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Text color selection */}
      <ScrollView horizontal className="bg-white p-4">
        <View className="flex-row space-x-2">
          {TEXT_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              className={`w-10 h-10 rounded-full items-center justify-center ${textColor === color ? 'border-2 border-blue-500' : ''}`}
              style={{ backgroundColor: '#333333' }}
              onPress={() => setTextColor(color)}
            >
              <Text style={{ color }}>A</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Post button */}
      <TouchableOpacity
        className="bg-blue-500 mx-4 my-4 p-3 rounded-full items-center"
        onPress={handlePost}
        disabled={loading || !text.trim()}
      >
        <Text className="text-white font-bold">
          {loading ? 'Posting...' : 'Post Status'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}