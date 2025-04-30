import { View, Text, FlatList, TextInput } from 'react-native';
import { useState } from 'react';
import { useUsers } from '@/libs/hooks/useUsers';
import UserCard from '@/components/layouts/components/search/UserCard';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, error } = useUsers(searchQuery);

  return (
    <View className="flex-1 bg-white p-4">
      <TextInput
        placeholder="Search users..."
        className="bg-gray-100 p-3 rounded-lg mb-4"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => <UserCard user={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text className="text-center mt-8 text-gray-500">
              No users found
            </Text>
          }
        />
      )}
    </View>
  );
}