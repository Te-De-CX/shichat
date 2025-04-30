// import { View, Text, TextInput, ScrollView } from 'react-native';
// import { useAuth } from '@/lib/providers/AuthProvider';
// import Button from '../../components/ui/Button';
// import { useState } from 'react';
// import { useUpdateProfile } from '../../hooks/useUpdateProfile';

// type ProfileForm = {
//   username: string;
//   fullName: string;
//   bio: string;
//   website: string;
// };

// export default function EditProfileScreen() {
//   const { user } = useAuth();
//   const { updateProfile, loading } = useUpdateProfile();
  
//   const [form, setForm] = useState<ProfileForm>({
//     username: user?.username || '',
//     fullName: user?.fullName || '',
//     bio: user?.bio || '',
//     website: user?.website || '',
//   });

//   const handleChange = (field: keyof ProfileForm, value: string) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!user?.uid) return;
//     try {
//       await updateProfile(user.uid, form);
//       // Optionally show success message
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//       // Optionally show error message to user
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-white p-4">
//       <Text className="text-xl font-bold mb-6">Edit Profile</Text>
      
//       <Text className="text-gray-500 mb-1">Username</Text>
//       <TextInput
//         className="border border-gray-200 p-3 rounded-lg mb-4"
//         value={form.username}
//         onChangeText={(text) => handleChange('username', text)}
//         placeholder="Enter your username"
//       />
      
//       <Text className="text-gray-500 mb-1">Full Name</Text>
//       <TextInput
//         className="border border-gray-200 p-3 rounded-lg mb-4"
//         value={form.fullName}
//         onChangeText={(text) => handleChange('fullName', text)}
//         placeholder="Enter your full name"
//       />
      
//       <Text className="text-gray-500 mb-1">Bio</Text>
//       <TextInput
//         className="border border-gray-200 p-3 rounded-lg mb-4"
//         value={form.bio}
//         onChangeText={(text) => handleChange('bio', text)}
//         placeholder="Tell us about yourself"
//         multiline
//         numberOfLines={3}
//       />
      
//       <Text className="text-gray-500 mb-1">Website</Text>
//       <TextInput
//         className="border border-gray-200 p-3 rounded-lg mb-6"
//         value={form.website}
//         onChangeText={(text) => handleChange('website', text)}
//         placeholder="https://example.com"
//         keyboardType="url"
//         autoCapitalize="none"
//       />
      
//       <Button 
//         title="Save Changes" 
//         onPress={handleSubmit} 
//         loading={loading}
//       />
//     </ScrollView>
//   );
// }