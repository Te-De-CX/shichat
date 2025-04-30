import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../provider/firebase';
import { User } from '../types/types';

export const useUsers = (searchQuery: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          where('username', '>=', searchQuery),
          where('username', '<=', searchQuery + '\uf8ff')
        );
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map(doc => doc.data() as User);
        setUsers(usersData);
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