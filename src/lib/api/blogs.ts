import { supabase } from '@/lib/supabase';
import { BlogPost, Block } from '@/types/blog';
import { BlockNoteEditor } from '@blocknote/core';

// Convert BlockNote format to our Block format (for backward compatibility)
export function blockNoteToBlocks(blockNoteContent: any[]): Block[] {
  if (!blockNoteContent || !Array.isArray(blockNoteContent)) {
    return [];
  }

  return blockNoteContent.map((bnBlock: any) => {
    let content = extractContent(bnBlock);
    let emoji: string | undefined;
    
    const blockType = mapBlockNoteTypeToBlockType(bnBlock.type);
    
    // Extract emoji from content if it's a heading or callout
    if (blockType === 'heading1' || blockType === 'heading2' || blockType === 'heading3' || blockType === 'callout') {
      // Check if content starts with an emoji (emoji pattern)
      const emojiMatch = content.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*(.+)$/u);
      if (emojiMatch) {
        emoji = emojiMatch[1];
        content = emojiMatch[2].trim();
      } else if (bnBlock.props?.icon) {
        // BlockNote callout might have icon in props
        emoji = bnBlock.props.icon;
      }
    }

    const block: Block = {
      id: bnBlock.id || `block-${Date.now()}-${Math.random()}`,
      type: blockType,
      content: content,
      emoji: emoji,
      imageUrl: bnBlock.props?.url || bnBlock.props?.src,
    };
    return block;
  });
}

// Convert our Block format to BlockNote format
export function blocksToBlockNote(blocks: Block[]): any[] {
  return blocks.map((block) => {
    const blockNoteBlock: any = {
      id: block.id,
      type: mapBlockTypeToBlockNoteType(block.type),
    };

    // Handle content - BlockNote uses array format for rich text
    if (block.content) {
      // For headings and callouts with emojis, include emoji in content
      let textContent = block.content;
      if (block.emoji && (block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3' || block.type === 'callout')) {
        textContent = `${block.emoji} ${block.content}`;
      }
      
      // BlockNote content format: array of text items
      blockNoteBlock.content = [
        {
          type: 'text',
          text: textContent,
          styles: {},
        },
      ];
    } else {
      blockNoteBlock.content = [];
    }

    // Add props based on block type
    if (block.type === 'image' && block.imageUrl) {
      blockNoteBlock.props = {
        url: block.imageUrl,
        ...(block.content && { caption: block.content }),
      };
    } else if (block.type === 'callout' && block.emoji) {
      // BlockNote callouts support icon prop
      blockNoteBlock.props = {
        icon: block.emoji,
      };
    } else if (block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3') {
      // Set heading level
      const level = block.type === 'heading1' ? 1 : block.type === 'heading2' ? 2 : 3;
      blockNoteBlock.props = {
        level: level,
      };
    }

    return blockNoteBlock;
  });
}

function mapBlockNoteTypeToBlockType(bnType: string): Block['type'] {
  const typeMap: Record<string, Block['type']> = {
    paragraph: 'paragraph',
    heading: 'heading1',
    'heading-1': 'heading1',
    'heading-2': 'heading2',
    'heading-3': 'heading3',
    bulletListItem: 'bulletList',
    numberedListItem: 'numberedList',
    quote: 'quote',
    divider: 'divider',
    callout: 'callout',
    codeBlock: 'code',
    image: 'image',
  };
  return typeMap[bnType] || 'paragraph';
}

function mapBlockTypeToBlockNoteType(blockType: Block['type']): string {
  const typeMap: Record<Block['type'], string> = {
    paragraph: 'paragraph',
    heading1: 'heading-1',
    heading2: 'heading-2',
    heading3: 'heading-3',
    bulletList: 'bulletListItem',
    numberedList: 'numberedListItem',
    quote: 'quote',
    divider: 'divider',
    callout: 'callout',
    code: 'codeBlock',
    image: 'image',
  };
  return typeMap[blockType] || 'paragraph';
}

function extractContent(bnBlock: any): string {
  let content = '';
  
  if (bnBlock.content && Array.isArray(bnBlock.content)) {
    // BlockNote uses array of inline content
    content = bnBlock.content
      .map((item: any) => {
        if (item.type === 'text') {
          return item.text || '';
        }
        return item.content || '';
      })
      .join('');
  } else if (typeof bnBlock.content === 'string') {
    content = bnBlock.content;
  } else {
    content = bnBlock.props?.text || bnBlock.props?.caption || '';
  }

  return content;
}

// Fetch all blogs
export async function fetchBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }

  return (data || []).map(transformSupabaseToBlogPost);
}

// Fetch single blog by ID
export async function fetchBlogById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching blog:', error);
    throw error;
  }

  return data ? transformSupabaseToBlogPost(data) : null;
}

// Create new blog
export async function createBlog(blog: Omit<BlogPost, 'id' | 'publishedDate'>): Promise<BlogPost> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const supabaseBlog = {
    title: blog.title,
    description: blog.description,
    emoji: blog.emoji,
    cover_image: blog.coverImage,
    tags: blog.tags,
    published_date: new Date().toISOString().split('T')[0],
    blocks: blog.blocks, // Store as JSONB (BlockNote format)
    is_published: blog.isPublished,
    author_id: user.id,
  };

  const { data, error } = await supabase
    .from('blogs')
    .insert(supabaseBlog)
    .select()
    .single();

  if (error) {
    console.error('Error creating blog:', error);
    throw error;
  }

  return transformSupabaseToBlogPost(data);
}

// Update blog
export async function updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const supabaseUpdates: any = {};

  if (updates.title !== undefined) supabaseUpdates.title = updates.title;
  if (updates.description !== undefined) supabaseUpdates.description = updates.description;
  if (updates.emoji !== undefined) supabaseUpdates.emoji = updates.emoji;
  if (updates.coverImage !== undefined) supabaseUpdates.cover_image = updates.coverImage;
  if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
  if (updates.publishedDate !== undefined) supabaseUpdates.published_date = updates.publishedDate;
  if (updates.blocks !== undefined) supabaseUpdates.blocks = updates.blocks;
  if (updates.isPublished !== undefined) supabaseUpdates.is_published = updates.isPublished;

  const { data, error } = await supabase
    .from('blogs')
    .update(supabaseUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog:', error);
    throw error;
  }

  return transformSupabaseToBlogPost(data);
}

// Delete blog
export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}

// Transform Supabase row to BlogPost
function transformSupabaseToBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    emoji: row.emoji,
    coverImage: row.cover_image,
    tags: row.tags || [],
    publishedDate: row.published_date,
    blocks: row.blocks || [], // Already in BlockNote format
    isPublished: row.is_published,
  };
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, blogId?: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${blogId || 'temp'}/${Date.now()}.${fileExt}`;
  // Don't include bucket name in path since we're using .from('blog-images')
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

