import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useStatus } from '@/libs/hooks/useStatus';
import { useUser } from '@/libs/hooks/useUser';
import { useEffect, useState } from 'react';

export default function StatusScreen() {
  const { userId } = useLocalSearchParams();
  const { statuses, viewStatus } = useStatus();
  const { user } = useUser(userId as string);
  const [currentIndex, setCurrentIndex] = useState(0);

  const userStatuses = statuses
    .filter(s => s.userId === userId)
    .sort((a, b) => a.createdAt - b.createdAt);

  useEffect(() => {
    if (userStatuses.length > 0) {
      viewStatus(userStatuses[currentIndex].id);
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < userStatuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!user || userStatuses.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No status available</Text>
      </View>
    );
  }

  const currentStatus = userStatuses[currentIndex];

  return (
    <View 
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: currentStatus.backgroundColor || '#000000' }}
    >
      {/* Status text */}
      <Text 
        className="text-2xl p-4 text-center"
        style={{ color: currentStatus.textColor || '#FFFFFF' }}
      >
        {currentStatus.text}
      </Text>

      {/* Status header */}
      <View className="absolute top-10 left-0 right-0 flex-row items-center p-4">
        <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 items-center justify-center">
          <Text>👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold">{user.username}</Text>
          <Text className="text-gray-300 text-xs">
            {new Date(currentStatus.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {/* Progress bars */}
      <View className="absolute top-0 left-0 right-0 flex-row px-1">
        {userStatuses.map((_, index) => (
          <View 
            key={index}
            className={`flex-1 h-1 mx-1 rounded-full ${index <= currentIndex ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </View>

      {/* Navigation controls */}
      <View className="absolute top-0 bottom-0 left-0 right-0 flex-row">
        <TouchableOpacity 
          className="flex-1" 
          onPress={handlePrev}
        />
        <TouchableOpacity 
          className="flex-1" 
          onPress={handleNext}
        />
      </View>
    </View>
  );
}