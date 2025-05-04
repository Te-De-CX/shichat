import { Stack } from 'expo-router';
import { AuthProvider } from '@/libs/services/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/components/ThemeProvider'
import '../global.css'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen 
            name="(auth)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              title: 'Chat',
              headerBackTitle: 'Back' 
            }} 
          />
          <Stack.Screen 
            name="post/[id]" 
            options={{ 
              title: 'Post',
              headerBackTitle: 'Back' 
            }} 
          />
          <Stack.Screen 
            name="profile/[id]" 
            options={{ 
              title: 'Profile',
              headerBackTitle: 'Back' 
            }} 
          />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}