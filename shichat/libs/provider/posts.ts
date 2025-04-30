import {
    collection,
    addDoc,
    serverTimestamp,
    updateDoc,
    increment,
    doc,
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { writeBatch } from 'firebase/firestore';
  
  export const createPost = async (
    userId: string,
    caption: string,
    imageUris: string[]
  ): Promise<string> => {
    // Upload images to storage
    const imageUrls = await Promise.all(
      imageUris.map(async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
      })
    );
  
    // Create post document
    const postRef = await addDoc(collection(db, 'posts'), {
      authorId: userId,
      caption,
      imageUrls,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isVideo: false,
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  
    // Update user's post count
    await updateDoc(doc(db, 'users', userId), {
      postsCount: increment(1),
    });
  
    return postRef.id;
  };
  
  export const likePost = async (postId: string, userId: string) => {
    const batch = writeBatch(db);
    
    // Add like to subcollection
    const likeRef = doc(db, 'posts', postId, 'likes', userId);
    batch.set(likeRef, { userId, createdAt: serverTimestamp() });
    
    // Update like count
    const postRef = doc(db, 'posts', postId);
    batch.update(postRef, { likesCount: increment(1) });
    
    await batch.commit();
  };