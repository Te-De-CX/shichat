import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../provider/firebase';
import { Post } from '../types/types';

export const usePost = (postId: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) return;

    const postRef = doc(db, 'posts', postId);
    const unsubscribe = onSnapshot(
      postRef,
      (doc) => {
        if (doc.exists()) {
          setPost({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
          } as Post);
        } else {
          setPost(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [postId]);

  return { post, loading, error };
};