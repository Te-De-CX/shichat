import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Comment } from '@/libs/types/types';
import { Ionicons } from '@expo/vector-icons';

interface CommentProps {
  comment: Comment;
}

export default function Comments({ comment }: CommentProps) {
  return (
    <View className="flex-row items-start space-x-2 mb-3">
      <Image
        source={{ uri: comment.authorId || 'https://i.imgur.com/0CE7jHL.png' }}
        className="w-8 h-8 rounded-full"
      />
      <View className="flex-1">
        <Text className="font-bold">{comment.authorId}</Text>
        <Text>{comment.text}</Text>
        <View className="flex-row space-x-3 mt-1">
          <Text className="text-gray-500 text-xs">
            {comment.createdAt.toDate().toLocaleDateString()}
          </Text>
          <TouchableOpacity>
            <Text className="font-bold text-xs">Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="heart-outline" size={16} />
      </TouchableOpacity>
    </View>
  );
}