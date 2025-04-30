import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const bgColor = variant === 'primary' ? 'bg-[#01FFE1]' : 'bg-gray-200';
  const textColor = variant === 'primary' ? 'text-[#001210]' : 'text-gray-800';
  
  return (
    <TouchableOpacity
      className={`${bgColor} py-3 rounded-lg items-center justify-center ${
        disabled || loading ? 'opacity-50' : ''
      }`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#001210' : '#6b7280'} />
      ) : (
        <Text className={`${textColor} font-bold text-lg`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}