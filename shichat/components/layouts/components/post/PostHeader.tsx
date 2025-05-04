import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { timeAgo } from '@/libs/helpers/helps';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/provider/firebase';

interface UserData {
  id: string;
  username: string;
  avatarUrl: string;
}

interface PostHeaderProps {
  authorId: string;
  createdAt: Date | Timestamp;
}

export default function PostHeader({ authorId, createdAt }: PostHeaderProps) {
  const [author, setAuthor] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Firestore Timestamp to Date if needed
  const postDate = createdAt instanceof Timestamp 
    ? createdAt.toDate() 
    : createdAt;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', authorId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAuthor({
            id: authorId,
            username: userData.username || 'Unknown User',
            avatarUrl: userData.avatarUrl || 'https://i.imgur.com/0CE7jHL.png',
          });
        } else {
          setAuthor({
            id: authorId,
            username: 'Unknown User',
            avatarUrl: 'https://i.imgur.com/0CE7jHL.png',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAuthor({
          id: authorId,
          username: 'Unknown User',
          avatarUrl: 'https://i.imgur.com/0CE7jHL.png',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authorId]);

  if (loading) {
    return (
      <View className="flex-row items-center justify-between p-3">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 rounded-full bg-gray-200" />
          <View className="w-20 h-4 bg-gray-200 rounded" />
        </View>
        <View className="w-16 h-4 bg-gray-200 rounded" />
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between p-3">
      <Link href={`/profile/${authorId}`} asChild>
        <TouchableOpacity className="flex-row items-center space-x-2">
          <Image
            source={{ uri: author?.avatarUrl }}
            className="w-8 h-8 rounded-full"
          />
          <Text className="font-bold">{author?.username}</Text>
        </TouchableOpacity>
      </Link>
      
      <View className="flex-row items-center space-x-3">
        <Text className="text-gray-500 text-sm">
          {timeAgo(postDate)}
        </Text>
        <TouchableOpacity>
          <Text className="font-bold">···</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}