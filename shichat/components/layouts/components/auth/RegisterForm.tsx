import { View, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import { registerWithEmail } from '@/libs/provider/auth';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

type FormData = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      username: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      // Register user with all data including fullName
      await registerWithEmail(
        data.email,
        data.password,
        data.username,
        data.fullName
      );

      // Show success message
      Alert.alert('Success', 'Account created successfully!');
      
      // Optionally navigate to login or home screen
      // navigation.navigate('Login');
      
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'username-taken':
          errorMessage = error.message || 'Username is already taken';
          break;
        case 'permission-denied':
          errorMessage = 'Database operation failed';
          break;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="space-y-4 p-4">
      {/* Email Input */}
      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
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
        )}
        name="email"
      />
      {errors.email && (
        <Text className="text-red-500 text-sm">{errors.email.message}</Text>
      )}

      {/* Username Input */}
      <Controller
        control={control}
        rules={{
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters'
          },
          maxLength: {
            value: 20,
            message: 'Username must be less than 20 characters'
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers and underscores'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Username"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.username}
            autoCapitalize="none"
            left={<TextInput.Icon icon="account" />}
          />
        )}
        name="username"
      />
      {errors.username && (
        <Text className="text-red-500 text-sm">{errors.username.message}</Text>
      )}

      {/* Full Name Input */}
      <Controller
        control={control}
        rules={{
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Full name must be at least 2 characters'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Full Name"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.fullName}
            left={<TextInput.Icon icon="account-circle" />}
          />
        )}
        name="fullName"
      />
      {errors.fullName && (
        <Text className="text-red-500 text-sm">{errors.fullName.message}</Text>
      )}

      {/* Password Input */}
      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
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
        )}
        name="password"
      />
      {errors.password && (
        <Text className="text-red-500 text-sm">{errors.password.message}</Text>
      )}

      {/* Confirm Password Input */}
      <Controller
        control={control}
        rules={{
          required: 'Please confirm your password',
          validate: value => 
            value === watch('password') || 'Passwords do not match'
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Confirm Password"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.confirmPassword}
            secureTextEntry={secureTextEntry}
            left={<TextInput.Icon icon="lock" />}
          />
        )}
        name="confirmPassword"
      />
      {errors.confirmPassword && (
        <Text className="text-red-500 text-sm">{errors.confirmPassword.message}</Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-[#01FFE1] py-3 rounded-lg items-center justify-center mt-4"
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text className="text-[#001210] font-bold text-lg">
          {loading ? 'Creating account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-blue-500 font-medium">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;