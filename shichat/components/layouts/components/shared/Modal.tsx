import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function AppModal({
  visible,
  onClose,
  title,
  children
}: AppModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-4 w-80">
          {title && (
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg">×</Text>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
}