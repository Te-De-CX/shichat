
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../provider/firebase';

type ProfileForm = {
  username: string;
  fullName: string;
  bio: string;
  website: string;
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = async (userId: string, formData: ProfileForm) => {
    try {
      setLoading(true);
      setError(null);
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        bio: formData.bio.trim(),
        website: formData.website.trim(),
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};