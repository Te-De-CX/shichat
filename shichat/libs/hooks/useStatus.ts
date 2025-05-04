import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../provider/firebase';
import { getDoc, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

interface Status {
  id: string;
  userId: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  expiresAt: Date;
  viewers: string[];
}

export const useStatus = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      setLoading(false);
      return;
    }

    const currentTime = Timestamp.now();
    
    const q = query(
      collection(db, 'statuses'),
      where('expiresAt', '>', currentTime),
      orderBy('expiresAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const statusData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              expiresAt: data.expiresAt?.toDate() || new Date(),
            } as Status;
          });
          setStatuses(statusData);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const viewStatus = async (statusId: string) => {
    try {
      if (!auth.currentUser?.uid) return;

      const statusRef = doc(db, 'statuses', statusId);
      
      // Check if user already viewed this status
      const statusDoc = await getDoc(statusRef);
      if (statusDoc.exists()) {
        const viewers = statusDoc.data().viewers || [];
        if (!viewers.includes(auth.currentUser.uid)) {
          await updateDoc(statusRef, {
            viewers: arrayUnion(auth.currentUser.uid)
          });
        }
      }
    } catch (err) {
      console.error('Error marking status as viewed:', err);
      // You might want to set error state here if needed
    }
  }

    const createTextStatus = async (text: string, backgroundColor = '#000000', textColor = '#FFFFFF') => {
      try {
        setLoading(true);
        setError(null);
  
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration
  
        await addDoc(collection(db, 'statuses'), {
          userId: auth.currentUser?.uid,
          text,
          backgroundColor,
          textColor,
          createdAt: serverTimestamp(),
          expiresAt: Timestamp.fromDate(expiresAt),
          viewers: []
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
  

  return { 
    statuses, 
    loading, 
    error, 
    createTextStatus,
    viewStatus,
  };
};