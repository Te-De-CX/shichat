import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../provider/firebase';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, 'statuses'),
      where('expiresAt', '>', serverTimestamp()),
      orderBy('expiresAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const statusData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate()
      } as Status));
      setStatuses(statusData);
    });

    return unsubscribe;
  }, []);

  const createTextStatus = async (text: string, backgroundColor = '#000000', textColor = '#FFFFFF') => {
    try {
      setLoading(true);
      setError(null);

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

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
    createTextStatus 
  };
};