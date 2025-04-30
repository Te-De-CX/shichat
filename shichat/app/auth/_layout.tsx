import { Stack } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
  return (
        <Stack>
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="verif" options={{ headerShown: false }} />
            <Stack.Screen name="congrats" options={{ headerShown: false }} />
        </Stack>
  )
}

export default AuthLayout