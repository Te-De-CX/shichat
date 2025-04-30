import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    increment, 
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { writeBatch } from 'firebase/firestore';
  
  export const createPost = async (
    userId: string,
    caption: string,
    imageUrls: string[]
  ) => {
    const postRef = await addDoc(collection(db, 'posts'), {
      authorId: userId,
      caption,
      imageUrls,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isVideo: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await updateDoc(doc(db, 'users', userId), {
      postsCount: increment(1)
    });
  
    return postRef.id;
  };
  
  export const likePost = async (postId: string, userId: string) => {
    const batch = writeBatch(db);
    
    // Add like to subcollection
    batch.set(doc(db, 'posts', postId, 'likes', userId), {
      userId,
      createdAt: new Date()
    });
    
    // Update like count
    batch.update(doc(db, 'posts', postId), {
      likesCount: increment(1)
    });
    
    await batch.commit();
  };
  
  export const addComment = async (
    postId: string,
    userId: string,
    text: string
  ) => {
    const commentRef = await addDoc(
      collection(db, 'posts', postId, 'comments'),
      {
        authorId: userId,
        text,
        likesCount: 0,
        repliesCount: 0,
        createdAt: new Date()
      }
    );
  
    // Update post comments count
    await updateDoc(doc(db, 'posts', postId), {
      commentsCount: increment(1)
    });
  
    return commentRef.id;
  };