import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../provider/firebase';
import { User } from '../types/types';
import { useAuth } from '../services/AuthProvider';

export const useCurrentUserData = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userDocRef = doc(db, 'users', user.uid); // Using UID as document ID

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setCurrentUser({
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as User);
        } else {
          setError(new Error('User document not found'));
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]); // Using UID as dependency

  return { currentUser, loading, error };
};