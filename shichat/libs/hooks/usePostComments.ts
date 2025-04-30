import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc,
  orderBy,  // Added missing import
  updateDoc, 
  doc,
  increment,
  serverTimestamp  // Added for proper timestamp handling
} from 'firebase/firestore';
import { db, auth } from '../provider/firebase';
export const usePostComments = (postId: string) => {
  const [comments, setComments] = useState<commentsDataProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  type commentsDataProp = {
    author: {
        id: string;
        username: string;
        avatarUrl: string;
    };
    createdAt: any;
    id: string;
}[]



  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsData:commentsDataProp = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Add proper typing for the author data
          author: {
            id: doc.data().authorId,
            username: '', // These would come from a user lookup
            avatarUrl: ''
          },
          createdAt: doc.data().createdAt.toDate()
        }));
        setComments(commentsData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [postId]);

  const addComment = async (text: string) => {
    if (!text.trim() || !auth.currentUser?.uid) return;
    
    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        text,
        authorId: auth.currentUser.uid,
        likesCount: 0,
        repliesCount: 0,
        createdAt: serverTimestamp()  // Better than new Date()
      });
      
      // Update post comments count
      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1)
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err as Error);
    }
  };

  return { comments, loading, error, addComment };
};