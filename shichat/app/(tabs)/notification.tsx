import { View, Text, FlatList } from 'react-native';
import { useNotifications } from '@/libs/hooks/useNotifications';
import NotificationItem from '@/components/layouts/components/notifications/NotificationItem';

export default function NotificationsScreen() {
  const { notifications, loading, error } = useNotifications();

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold p-4">Notifications</Text>
      
      {loading ? (
        <Text className="text-center mt-8">Loading notifications...</Text>
      ) : error ? (
        <Text className="text-center mt-8 text-red-500">
          Error: {error.message}
        </Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text className="text-center mt-8 text-gray-500">
              No notifications yet
            </Text>
          }
        />
      )}
    </View>
  );
}