import { View, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/libs/services/AuthProvider';
import RegisterForm from '@/components/layouts/components/auth/RegisterForm';

export default function RegisterScreen() {
  const { user } = useAuth();

  if (user) {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50 pt-4 px-6 justify-center">
      <View className="mb-10 flex-col gap-2">
        <Text className="text-5xl font-bold">Create your</Text>
        <Text className="text-5xl font-bold">account</Text>
      </View>

      <RegisterForm />

      <View className="mt-6 mb-5 flex-row justify-center items-center">
      </View>
    </View>
  );
}