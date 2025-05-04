// import React, { useEffect } from 'react';
// import { View, Text, FlatList } from 'react-native';
// import { useNotifications } from '@/libs/hooks/useNotifications';
// import NotificationItem from '@/components/layouts/components/notifications/NotificationItem';

// const NotificationsScreen = () => {
//   const { notifications, loading, error, markAsRead } = useNotifications();

//   if (loading) {
//     return <Text>Loading notifications...</Text>;
//   }

//   if (error) {
//     return <Text>Error: {error.message}</Text>;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={notifications}
//         renderItem={({ item }) => (
//           <NotificationItem 
//             notification={item} 
//             // onPress={() => markAsRead(item.id)}
//           />
//         )}
//         keyExtractor={item => item.id}
//         ListEmptyComponent={<Text>No notifications</Text>}
//       />
//     </View>
//   );
// };

// export default NotificationsScreen;