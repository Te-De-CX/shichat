import { View, Text, StyleSheet, Image } from 'react-native';
import { auth } from '@/libs/provider/firebase';
import { Timestamp } from 'firebase/firestore';
import { Message } from '@/libs/types/types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isCurrentUser = message.senderId === auth.currentUser?.uid;
  const timestamp = message.createdAt instanceof Timestamp 
    ? message.createdAt.toDate() 
    : message.createdAt;
  const timeString = timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {/* Media content (image/video) */}
      {message.mediaUrl && (
        <Image
          source={{ uri: message.mediaUrl }}
          style={[
            styles.media,
            isCurrentUser ? styles.currentUserMedia : styles.otherUserMedia,
          ]}
          resizeMode="cover"
        />
      )}

      {/* Text message */}
      {message.text && (
        <Text
          style={[
            styles.text,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.text}
        </Text>
      )}

      {/* Timestamp and read status */}
      <View style={styles.footer}>
        <Text style={[
          styles.time,
          isCurrentUser ? styles.currentUserTime : styles.otherUserTime
        ]}>
          {timeString}
        </Text>
        {isCurrentUser && (
          <Text style={styles.readStatus}>
            {message.isRead ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 2,
  },
  text: {
    fontSize: 16,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: 'black',
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserMedia: {
    alignSelf: 'flex-end',
  },
  otherUserMedia: {
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    marginRight: 4,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTime: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  readStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ChatBubble;