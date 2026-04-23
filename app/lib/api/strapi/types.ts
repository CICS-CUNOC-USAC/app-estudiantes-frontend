import type { BlocksContent } from "vue-strapi-blocks-renderer";

export interface BaseContentItem {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ContentManual extends BaseContentItem {
  name: string;
  description: string;
  content: BlocksContent;
  slug: string;
}

export interface Comunicado extends BaseContentItem {
    id:          number;
    content:     BlocksContent;
    title:       string;
    description: string;
}

export interface StrapiPostReactionResponse {
  // counts: {
  //   like: number;
  //   love: number;
  //   haha: number;
  //   sad: number;
  //   angry: number;
  // };
  counts: Record<string, number>;
  userReaction: string | null;
  total: number;
}

export interface StrapiPostCommentUser {
  id: number;
  name: string | null;
}

export interface StrapiPostCommentReply {
  id: number;
  content: string;
  createdAt: string;
  user: StrapiPostCommentUser;
}

export interface StrapiPostComment {
  id: number;
  content: string;
  createdAt: string;
  user: StrapiPostCommentUser;
  replies: StrapiPostCommentReply[];
}

export const REACTION_TYPES = ['like', 'love', 'haha', 'sad', 'angry'] as const;

export const MAPPED_REACTIONS_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  sad: '😢',
  angry: '😠'
};
export const MAPPED_REACTIONS_ICON_COMPONENTS: Record<string, string> = {
  like: 'fluent-emoji-flat:thumbs-up-light',
  love: 'fluent-emoji-flat:heart-suit',
  haha: 'fluent-emoji-flat:face-with-tears-of-joy',
  sad: 'fluent-emoji-flat:crying-face',
  angry: 'fluent-emoji-flat:angry-face'
};