import { Timestamp } from "firebase/firestore";

interface BaseDocument {
  id: string;
  createdAt:  Timestamp | Date;
}

export interface User  {
  id?: string;
  uid: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  website: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  lastActive: Timestamp | Date;
  isPrivate: boolean;
  fcmToken?: string;
}

export interface Location {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
}

export interface Post extends BaseDocument {
  authorId: string;
  caption: string;
  imageUrls: string[];
  videoUrl?: string;
  location?: Location;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewCount?: number;
  isVideo?: boolean;
  isArchived: boolean;
  updatedAt: Timestamp | Date;
}

export interface Comment extends BaseDocument {
  authorId: string;
  text: string;
  likesCount: number;
  repliesCount: number;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface Message extends BaseDocument {
  senderId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  isRead: boolean;
  readBy: string[];
  deletedFor: string[];
}

export interface Chat extends BaseDocument {
  participants: string[];
  participantData: {},
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: Timestamp | Date;
  };
  unreadCounts: Record<string, number>;
  updatedAt: Timestamp | Date;
  isGroup: boolean;
  groupInfo?: {
    name: string;
    adminIds: string[];
    avatarUrl: string;
  };
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'storyMention';

export interface Notification extends BaseDocument {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  postId?: string;
  commentId?: string;
  chatId?: string;
  isRead: boolean;
}

export type StoryMediaType = 'image' | 'video';

export interface Story extends BaseDocument {
  authorId: string;
  mediaUrl: string;
  mediaType: StoryMediaType;
  viewers: string[];
  expiresAt: Timestamp | Date;
}

export interface Status {
  id: string;
  userId: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  expiresAt: Date;
  viewers: string[];
}