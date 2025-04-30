import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    UserCredential,
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  export const registerWithEmail = async (
    email: string,
    password: string,
    username: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName: username,
    });
    return userCredential;
  };
  
  export const loginWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  
  export const logout = async () => {
    return await signOut(auth);
  };