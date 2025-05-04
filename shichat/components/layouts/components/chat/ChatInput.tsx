import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => Promise<void> | void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || isSending) return;
    
    try {
      setIsSending(true);
      console.log('Attempting to send message:', text);
      await onSend(text);
      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View className="flex-row items-center p-2 border-t border-gray-200 bg-white">
      <TouchableOpacity className="p-2" hitSlop={10}>
        <Ionicons name="add" size={24} color="#01FFE1" />
      </TouchableOpacity>
      
      <TextInput
        className="flex-1 border border-gray-200 rounded-full px-4 py-2 mx-2"
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        editable={!isSending}
      />
      
      <TouchableOpacity 
        className="p-2"
        onPress={handleSend}
        disabled={!text.trim() || isSending}
        hitSlop={10}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#9ca3af" />
        ) : (
          <Ionicons 
            name="send" 
            size={24} 
            color={!text.trim() ? "#6b7280" : "#01FFE1"} 
          />
        )}
      </TouchableOpacity>
    </View>
  );
}