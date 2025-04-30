import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import { loginWithEmail } from '@/libs/provider/auth';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your navigation stack types
type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  // Add other screens here
};

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

type FirebaseAuthError = {
  code: string;
  message: string;
};

const LoginForm = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [loading, setLoading] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);
      await loginWithEmail(data.email, data.password);
      // Navigation handled by auth state change in AuthProvider
    } catch (error: unknown) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const authError = error as FirebaseAuthError;
        switch (authError.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailInput = ({ field: { onChange, onBlur, value } }: { 
    field: { 
      onChange: (text: string) => void; 
      onBlur: () => void; 
      value: string 
    } 
  }) => (
    <TextInput
      label="Email"
      mode="outlined"
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      error={!!errors.email}
      keyboardType="email-address"
      autoCapitalize="none"
      left={<TextInput.Icon icon="email" />}
    />
  );

  const renderPasswordInput = ({ field: { onChange, onBlur, value } }: { 
    field: { 
      onChange: (text: string) => void; 
      onBlur: () => void; 
      value: string 
    } 
  }) => (
    <TextInput
      label="Password"
      mode="outlined"
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      error={!!errors.password}
      secureTextEntry={secureTextEntry}
      left={<TextInput.Icon icon="lock" />}
      right={
        <TextInput.Icon 
          icon={secureTextEntry ? "eye-off" : "eye"} 
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        />
      }
    />
  );

  return (
    <View className="space-y-4">
      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
        render={renderEmailInput}
        name="email"
      />
      {errors.email && (
        <Text className="text-red-500 text-sm">{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        }}
        render={renderPasswordInput}
        name="password"
      />
      {errors.password && (
        <Text className="text-red-500 text-sm">{errors.password.message}</Text>
      )}

      <TouchableOpacity 
        className="mt-2"
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text className="text-right text-blue-500">Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-[#01FFE1] py-3 rounded-lg items-center justify-center mt-4"
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text className="text-[#001210] font-bold text-lg">
          {loading ? 'Logging in...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center justify-center mt-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="px-3 text-gray-500">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center border border-gray-300 py-3 rounded-lg mt-4"
        onPress={() => {}}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text className="ml-2 font-medium">Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;