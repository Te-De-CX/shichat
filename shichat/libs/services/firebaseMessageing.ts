// import { app } from '../provider/firebase';
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';

// // Initialize Firebase Messaging with the app instance
// const firebaseMessaging = messaging(app);

// export const getFCMToken = async (userId?: string) => {
//   try {
//     // Check if we have notification permissions
//     const authStatus = await Notifications.requestPermissionsAsync();
//     const enabled =
//       authStatus.status === 'granted'

//     if (!enabled) {
//       console.warn('Notification permissions not granted');
//       return null;
//     }

//     // Get the token
//     const token = await firebaseMessaging.getToken();
//     console.log('FCM Token:', token);
//     return token;
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//     return null;
//   }
// };

// export const setupForegroundHandler = () => {
//   return firebaseMessaging.onMessage(async remoteMessage => {
//     console.log('Foreground message:', remoteMessage);
    
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: remoteMessage.notification?.title || 'New notification',
//         body: remoteMessage.notification?.body || '',
//         data: remoteMessage.data || {},
//       },
//       trigger: null,
//     });
//   });
// };

// export const setupBackgroundHandler = () => {
//   return firebaseMessaging.setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Background message:', remoteMessage);
//   });
// };

// export const checkInitialNotification = async () => {
//   return await Notifications.getLastNotificationResponseAsync();
// };

// export const onNotificationOpenedApp = (callback: (notification: FirebaseMessagingTypes.RemoteMessage) => void) => {
//   return firebaseMessaging.onNotificationOpenedApp(callback);
// };