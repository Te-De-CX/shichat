import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { logout } from '@/libs/provider/auth'

const post = () => {
  return (
    <View>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text>post</Text>
    </View>
  )
}

export default post