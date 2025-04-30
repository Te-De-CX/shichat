import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileTabsProps {
  activeTab: 'posts' | 'saved';
  onTabChange: (tab: 'posts' | 'saved') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <View className="flex-row border-t border-gray-200">
      <TouchableOpacity 
        className={`flex-1 items-center py-3 ${activeTab === 'posts' ? 'border-t-2 border-black' : ''}`}
        onPress={() => onTabChange('posts')}
      >
        <Ionicons 
          name="grid" 
          size={24} 
          color={activeTab === 'posts' ? '#000' : '#6b7280'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        className={`flex-1 items-center py-3 ${activeTab === 'saved' ? 'border-t-2 border-black' : ''}`}
        onPress={() => onTabChange('saved')}
      >
        <Ionicons 
          name="bookmark" 
          size={24} 
          color={activeTab === 'saved' ? '#000' : '#6b7280'} 
        />
      </TouchableOpacity>
    </View>
  );
}