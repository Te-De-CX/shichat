import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '@/libs/services/AuthProvider';
import { useState } from 'react';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-6">Settings</Text>
      
      <View className="mb-6">
        <Text className="font-bold mb-2">Account</Text>
        <TouchableOpacity className="py-3 border-b border-gray-100">
          <Text>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 border-b border-gray-100">
          <Text>Privacy Settings</Text>
        </TouchableOpacity>
      </View>
      
      <View className="mb-6">
        <Text className="font-bold mb-2">Preferences</Text>
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>
      
      <View className="mb-6">
        <Text className="font-bold mb-2">About</Text>
        <TouchableOpacity className="py-3 border-b border-gray-100">
          <Text>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 border-b border-gray-100">
          <Text>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 border-b border-gray-100">
          <Text>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        className="py-3 items-center mt-8"
        onPress={logout}
      >
        <Text className="text-red-500 font-bold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}