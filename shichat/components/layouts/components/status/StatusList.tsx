import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useStatus } from '@/libs/hooks/useStatus';
import { useUsers } from '@/libs/hooks/useUsers';
import { auth } from '@/libs/provider/firebase'; 
import { Status, User } from '@/libs/types/types';

interface StatusGroup {
  user: User;
  statuses: Status[];
  viewed: boolean;
}

export default function StatusList() {
  const { statuses } = useStatus();
  const { users } = useUsers(''); // Pass empty string to get all users

  // Group statuses by user
  const statusGroups = statuses.reduce((acc: Record<string, StatusGroup>, status) => {
    const user = users.find(u => u.id === status.userId);
    if (!user) return acc;
    
    if (!acc[status.userId]) {
      acc[status.userId] = {
        user,
        statuses: [],
        viewed: status.viewers.includes(auth.currentUser?.uid || '')
      };
    }
    acc[status.userId].statuses.push(status);
    return acc;
  }, {});

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={Object.values(statusGroups)}
        keyExtractor={(item) => item.user.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="p-4" onPress={() => {}}>
            <View className="flex-row items-center">
              <Text className="text-white">{item.user.username}</Text>
              {item.viewed && <Text className="text-gray-500 ml-2">Viewed</Text>}
            </View>
            <FlatList
              data={item.statuses}
              horizontal
              keyExtractor={(status) => status.id}
              renderItem={({ item: status }) => (
                <View className="m-2 p-4" style={{ backgroundColor: status.backgroundColor || '#000' }}>
                  <Text className="text-white">{status.text}</Text>
                </View>
              )}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}