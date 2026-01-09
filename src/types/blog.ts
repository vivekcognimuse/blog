export type BlockType = 
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'divider'
  | 'callout'
  | 'code'
  | 'image';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  emoji?: string;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  emoji: string;
  coverImage: string;
  tags: string[];
  publishedDate: string;
  blocks: Block[];
  isPublished: boolean;
}

export type ViewMode = 'grid' | 'grouped';
export type SortOrder = 'newest' | 'oldest';
