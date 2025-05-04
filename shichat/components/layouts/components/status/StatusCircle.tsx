import { View, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { auth } from '@/libs/provider/firebase';

interface StatusCircleProps {
  hasStatus: boolean;
}

export default function StatusCircle({ hasStatus }: StatusCircleProps) {
  return (
    <View className="items-center">
      <View className={`w-16 h-16 rounded-full items-center justify-center 
        ${hasStatus ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
        <View className="w-14 h-14 rounded-full bg-white items-center justify-center">
          <Text className="text-xl">{hasStatus ? '💬' : '+'}</Text>
        </View>
      </View>
    </View>
  );
}