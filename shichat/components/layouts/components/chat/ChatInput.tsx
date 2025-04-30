import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View className="flex-row items-center p-2 border-t border-gray-200 bg-white">
      <TouchableOpacity className="p-2">
        <Ionicons name="add" size={24} color="#01FFE1" />
      </TouchableOpacity>
      
      <TextInput
        className="flex-1 border border-gray-200 rounded-full px-4 py-2 mx-2"
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
      />
      
      <TouchableOpacity 
        className="p-2"
        onPress={handleSend}
        disabled={!text.trim()}
      >
        <Ionicons 
          name="send" 
          size={24} 
          color={text.trim() ? "#01FFE1" : "#6b7280"} 
        />
      </TouchableOpacity>
    </View>
  );
}