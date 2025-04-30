import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../provider/firebase';
import { increment, updateDoc, doc } from 'firebase/firestore';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPost = async (caption: string, imageUris: string[]) => {
    if (!auth.currentUser?.uid) return;
    setLoading(true);
    setError(null);

    try {
      // Upload images to storage
      const imageUrls = await Promise.all(
        imageUris.map(async (uri) => {
          const response = await fetch(uri);
          const blob = await response.blob();
        })
      );

      // Create post document
      await addDoc(collection(db, 'posts'), {
        authorId: auth.currentUser?.uid,
        caption,
        imageUrls,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        isVideo: false,
        isArchived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update user's post count
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        postsCount: increment(1)
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
};