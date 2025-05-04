import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserData {
  email: string;
  username: string;
  fullName?: string;
  createdAt: string;
  uid: string;
}

export const registerWithEmail = async (
  email: string,
  password: string,
  username: string,
  fullName: string
): Promise<UserCredential> => {
  try {
    // 1. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const user = userCredential.user;

    // 2. Update user profile with display name
    await updateProfile(user, {
      displayName: username,
    });

    // 3. Create user document in Firestore
    const userData: UserData = {
      email,
      username,
      fullName,
      createdAt: new Date().toISOString(),
      uid: user.uid
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

// Optional: Function to get user data from Firestore
export const getUserData = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  return null;
};