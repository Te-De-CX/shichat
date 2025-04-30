
import {  Text, TouchableOpacity, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const CongratsScreen = () => {
    
  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-4 px-6 justify-center pb-20">
        <View className='flex-1 items-center justify-center' >
            {/* <Image         
                source={require('../../assets/images/auth/congrats.png')}
                className="w-11/12 h-1/2 object-cover mb-5"
                resizeMode="contain"
            /> */}
            <View>
                <Text className="text-5xl text-center font-bold capitalize my-5">congratulation !</Text>
                <View className='' >
                    <Text className="text-center font-semibold text-xl capitalize">account created </Text>
                    <Text className='capitalize text-center  font-semibold text-xl' >successfully</Text>
                </View>
            </View>
        </View>
      <TouchableOpacity className="mt-8 bg-[#01FFE1] py-3 rounded-2xl">
        <Link href="/(tabs)" className="text-[#001210] capitalize py-3 text-2xl text-center font-semibold">get started</Link>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default CongratsScreen;