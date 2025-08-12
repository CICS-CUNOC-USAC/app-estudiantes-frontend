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