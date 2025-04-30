import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PostActionsProps {
  postId: string;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export default function PostActions({
  postId,
  isLiked,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostActionsProps) {
  return (
    <View className="flex-row justify-between px-4 py-2">
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={onLike}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#ff0000' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare}>
          <Ionicons name="paper-plane-outline" size={24} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onSave}>
        <Ionicons name="bookmark-outline" size={24} />
      </TouchableOpacity>
    </View>
  );
}