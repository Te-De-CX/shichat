import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../provider/firebase';
import { Post } from '../types/types';

export const useUserPosts = (userId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasIndexError, setHasIndexError] = useState(false);

  const processSnapshot = useCallback((snapshot: QuerySnapshot<DocumentData>) => {
    const postsData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      } as Post;
    });
    setPosts(postsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasIndexError(false);

    try {
      const q = query(
        collection(db, 'posts'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => processSnapshot(snapshot),
        (err) => {
          if (err.message.includes('index')) {
            setHasIndexError(true);
          }
          setError(err);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [userId, processSnapshot]);

  return { 
    posts, 
    loading, 
    error,
    hasIndexError,
    refresh: () => {
      setLoading(true);
      setError(null);
    }
  };
};