import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { writeBatch, increment } from 'firebase/firestore';

export const createUserProfile = async (
  userId: string,
  email: string,
  username: string
) => {
  await setDoc(doc(db, 'users', userId), {
    uid: userId,
    email,
    username,
    fullName: '',
    avatarUrl: '',
    bio: '',
    website: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    createdAt: new Date(),
    isPrivate: false
  });
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    username?: string;
    fullName?: string;
    bio?: string;
    website?: string;
    avatarUrl?: string;
  }
) => {
  await updateDoc(doc(db, 'users', userId), updates);
};

export const followUser = async (followerId: string, followingId: string) => {
  const batch = writeBatch(db);
  
  // Create follow relationship
  batch.set(doc(db, 'followers', `${followingId}_${followerId}`), {
    userId: followingId,
    followerId,
    createdAt: new Date()
  });
  
  // Update follower counts
  batch.update(doc(db, 'users', followingId), {
    followersCount: increment(1)
  });
  
  batch.update(doc(db, 'users', followerId), {
    followingCount: increment(1)
  });
  
  await batch.commit();
};