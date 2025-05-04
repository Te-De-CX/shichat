import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/libs/services/AuthProvider';
import LoginForm from '@/components/layouts/components/auth/LoginForm';

export default function LoginScreen() {
  const { user } = useAuth();

  if (user) {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50 pt-4 px-6 justify-center">
      <View className="mb-10 flex-col gap-2">
        <Text className="text-5xl font-bold">Welcome back</Text>
        <Text className="text-5xl font-bold">to Shi Chat</Text>
      </View>

      <LoginForm />

      <View className="mt-6 mb-5 flex-row justify-center items-center">
        <Text className="text-black text-xl capitalize font-semibold">
          Don't have an account?{' '}
        </Text>
        <Link href="/auth/register" className="text-[#00463E] font-bold text-lg">
          Sign Up
        </Link>
      </View>
    </View>
  );
}