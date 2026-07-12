import type { BlocksContent } from "vue-strapi-blocks-renderer";

export interface SingleTypeResponse<T> {
  data: T;
  meta: Record<string, any>;
}

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
    hero_image:  {
      url: string;
      alternativeText: string;
    }
}

export interface StrapiPostReactionResponse {
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

// Alert related
export type AlertType = 'normal' | 'informacion' | 'advertencia' | 'peligro';

export interface CurrentAlert extends BaseContentItem {
  title: string;
  active: boolean;
  details: BlocksContent;
  type: AlertType;
  active_details: boolean;
}

export const MAPPED_ALERT_TYPES: Record<AlertType, { icon: string; color: string }> = {
  normal: { icon: 'icon-park-twotone:info', color: 'bg-gray-500/50 dark:bg-gray-600/40' },
  informacion: { icon: 'icon-park-twotone:info', color: 'bg-cyan-500/50 dark:bg-blue-600/35' },
  advertencia: { icon: 'icon-park-twotone:attention', color: 'bg-yellow-500/50 dark:bg-yellow-600/40' },
  peligro: { icon: 'icon-park-twotone:caution', color: 'bg-red-500/50 dark:bg-red-600/40' }
};