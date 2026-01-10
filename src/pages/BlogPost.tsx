import { useParams, Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlogs';
import { BlockRenderer } from '@/components/blog/BlockRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { blockNoteToBlocks } from '@/lib/api/blogs';
import { Block } from '@/types/blog';

const tagColors: Record<string, string> = {
  'Books': 'bg-tag-books/20 text-tag-books border-tag-books/30',
  'Learning': 'bg-tag-learning/20 text-tag-learning border-tag-learning/30',
  'Food': 'bg-tag-food/20 text-tag-food border-tag-food/30',
  'Travel': 'bg-tag-travel/20 text-tag-travel border-tag-travel/30',
  'Mindfulness': 'bg-tag-mindfulness/20 text-tag-mindfulness border-tag-mindfulness/30',
  'Mental Health': 'bg-tag-mental-health/20 text-tag-mental-health border-tag-mental-health/30',
  'Psychology': 'bg-tag-psychology/20 text-tag-psychology border-tag-psychology/30',
  'Lifestyle': 'bg-tag-lifestyle/20 text-tag-lifestyle border-tag-lifestyle/30',
};

export default function BlogPost() {
  const { id } = useParams();
  const { data: blog, isLoading } = useBlog(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-semibold mb-4">Blog post not found</h1>
          <Link to="/blog">
            <Button variant="outline">Back to blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert blocks to Block format for rendering
  const displayBlocks: Block[] = (() => {
    if (!blog.blocks || !Array.isArray(blog.blocks) || blog.blocks.length === 0) {
      return [];
    }

    // Check if blocks are in BlockNote format (content is array) or Block format (content is string)
    const firstBlock = blog.blocks[0];
    if (firstBlock && 'type' in firstBlock) {
      if (Array.isArray(firstBlock.content)) {
        // BlockNote format - convert to Block format
        return blockNoteToBlocks(blog.blocks as any[]);
      } else if (typeof firstBlock.content === 'string') {
        // Already in Block format
        return blog.blocks as Block[];
      }
    }
    
    // Default: assume BlockNote format and convert
    return blockNoteToBlocks(blog.blocks as any[]);
  })();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{blog.emoji}</span>
            <span className="font-serif font-medium text-foreground truncate max-w-[200px] sm:max-w-[400px]">
              {blog.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 50%' }}
        />
      </div>

      {/* Content */}
      <main className="container max-w-3xl py-8">
        {/* Emoji */}
        <div className="text-6xl mb-4 -mt-16 relative z-10">{blog.emoji}</div>

        {/* Title & Meta */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-foreground mb-4">
            {blog.title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">{blog.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            {blog.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  'text-sm font-medium border',
                  tagColors[tag] || 'bg-muted text-muted-foreground'
                )}
              >
                {tag}
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground">
              {format(new Date(blog.publishedDate), 'MMMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Blocks */}
        <article className="blog-content">
          {displayBlocks.length > 0 ? (
            <div className="space-y-4">
              {displayBlocks.map((block, index) => (
                <BlockRenderer key={block.id || `block-${index}`} block={block} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No content available.</p>
          )}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
