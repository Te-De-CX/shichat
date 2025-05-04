// import { useState, useEffect } from 'react';
// import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
// import { db } from '../provider/firebase';
// import { useAuth } from '../services/AuthProvider';
// import { Notification } from '../types/types';
// import { configureNotifications, requestNotificationPermissions } from '../services/notificationService';
// import { getFCMToken, setupForegroundHandler } from '../services/firebaseMessageing'

// export const useNotifications = () => {
//   const { user } = useAuth();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   // Initialize notifications
//   useEffect(() => {
//     const init = async () => {
//       try {
//         await configureNotifications();
//         await requestNotificationPermissions();
        
//         if (user?.uid) {
//           await getFCMToken(user.uid);
//         }
//       } catch (error) {
//         console.error('Notification initialization error:', error);
//       }
//     };

//     init();
//   }, [user?.uid]);

//   // Setup foreground message handler
//   useEffect(() => {
//     const unsubscribeForeground = setupForegroundHandler();
//     return unsubscribeForeground;
//   }, []);

//   // Fetch notifications from Firestore
//   useEffect(() => {
//     if (!user?.uid) return;

//     const q = query(
//       collection(db, 'notifications'),
//       where('recipientId', '==', user.uid),
//       where('isRead', '==', false)
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const notificationsData = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         })) as Notification[];
//         setNotifications(notificationsData);
//         setLoading(false);
//       },
//       (err) => {
//         setError(err);
//         setLoading(false);
//       }
//     );

//     return unsubscribe;
//   }, [user?.uid]);

//   const markAsRead = async (notificationId: string) => {
//     try {
//       await updateDoc(doc(db, 'notifications', notificationId), {
//         isRead: true
//       });
//     } catch (err) {
//       setError(err as Error);
//     }
//   };

//   return {
//     notifications,
//     loading,
//     error,
//     markAsRead,
//   };
// };