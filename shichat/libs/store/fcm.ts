
// import { getToken } from 'firebase/messaging';

// // In your login/signup flow:
// const storeFCMToken = async (userId: string) => {
//   try {
//     const token = await getToken(messaging);
//     if (token) {
//       await updateDoc(doc(db, 'users', userId), {
//         fcmToken: token
//       });
//     }
//   } catch (error) {
//     console.error('Error storing FCM token:', error);
//   }
// };