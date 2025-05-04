

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// exports.sendNotification = functions.firestore
//   .document('notifications/{notificationId}')
//   .onCreate(async (snapshot, context) => {
//     const notification = snapshot.data();
//     const recipientId = notification.recipientId;

//     // Get the recipient's FCM token
//     const userDoc = await admin.firestore().collection('users').doc(recipientId).get();
//     const fcmToken = userDoc.data()?.fcmToken;

//     if (!fcmToken) return;

//     const message = {
//       notification: {
//         title: notification.title || 'New notification',
//         body: notification.message || '',
//       },
//       token: fcmToken,
//       data: {
//         notificationId: snapshot.id,
//         type: notification.type,
//       },
//     };

//     try {
//       await admin.messaging().send(message);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   });