// hooks/useLikePost.ts
import { useState, useEffect } from 'react';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../provider/firebase';
import { useAuth } from '../services/AuthProvider';

export const useLikePost = (postId: string, initialLikes: number) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  // Check if user already liked this post
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return;
      
      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const likedBy = postSnap.data().likedBy || [];
          setIsLiked(likedBy.includes(user.uid));
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkIfLiked();
  }, [postId, user?.uid]);

  const toggleLike = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const postRef = doc(db, 'posts', postId);
      
      if (isLiked) {
        // Unlike the post
        await updateDoc(postRef, {
          likesCount: increment(-1),
          likedBy: arrayRemove(user.uid)
        });
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Like the post
        await updateDoc(postRef, {
          likesCount: increment(1),
          likedBy: arrayUnion(user.uid)
        });
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleLike, isLiked, isLoading, likesCount };
};