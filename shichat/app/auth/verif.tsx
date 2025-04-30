
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const VerifScreen = () => {
    
  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-4 px-6">
      <View className="mb-10  flex-col gap-2 text-gray-800 capitalize w-2/2">
        <Text className="text-5xl  font-bold">enter your phone</Text>
        <Text className="text-5xl  font-bold">number or email</Text>
      </View>

      <View className="space-y-4 flex-col gap-5 mt-5">

        <View className="flex-row items-center bg-white rounded-lg p-4 border border-gray-200">
          <Ionicons name="mail-outline" size={20} color="black" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            className="flex-1 placeholder:text-black text-lg"
            placeholderTextColor="black"
          />
        </View>
      </View>

      <TouchableOpacity className="mt-8 bg-[#01FFE1] py-3 rounded-2xl">
        <Text className="text-[#001210] capitalize py-3 text-2xl text-center font-semibold">verification</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-8 bg-[#01FFE1] py-3 rounded-2xl">
        <Text className="text-[#001210] capitalize py-3 text-2xl text-center font-semibold">later</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default VerifScreen;