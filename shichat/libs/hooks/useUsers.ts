import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../provider/firebase';
import { User } from '../types/types';

export const useUsers = (searchQuery?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const usersRef = collection(db, 'users');
        
        if (searchQuery?.trim()) {
          // Search for specific users
          const q = query(
            usersRef,
            where('username', '>=', searchQuery),
            where('username', '<=', searchQuery + '\uf8ff'),
            orderBy('username')
          );
          const snapshot = await getDocs(q);
          const usersData = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
          } as User));
          setUsers(usersData);
        } else {
          // Get all users (for status list)
          const q = query(usersRef);
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as User));
            setUsers(usersData);
          });
          return unsubscribe;
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return { users, loading, error };
};