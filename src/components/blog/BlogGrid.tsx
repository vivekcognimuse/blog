import { BlogPost } from '@/types/blog';
import { BlogCard } from './BlogCard';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogGridProps {
  blogs: BlogPost[];
  isAdmin?: boolean;
}

export function BlogGrid({ blogs, isAdmin = false }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog, index) => (
        <div
          key={blog.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <BlogCard blog={blog} isAdmin={isAdmin} />
        </div>
      ))}
    </div>
  );
}

interface BlogGroupedViewProps {
  blogs: BlogPost[];
  isAdmin?: boolean;
}

const tagColors: Record<string, string> = {
  'Books': 'bg-tag-books/20 text-tag-books',
  'Learning': 'bg-tag-learning/20 text-tag-learning',
  'Food': 'bg-tag-food/20 text-tag-food',
  'Travel': 'bg-tag-travel/20 text-tag-travel',
  'Mindfulness': 'bg-tag-mindfulness/20 text-tag-mindfulness',
  'Mental Health': 'bg-tag-mental-health/20 text-tag-mental-health',
  'Psychology': 'bg-tag-psychology/20 text-tag-psychology',
  'Lifestyle': 'bg-tag-lifestyle/20 text-tag-lifestyle',
};

export function BlogGroupedView({ blogs, isAdmin = false }: BlogGroupedViewProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const groupedBlogs = blogs.reduce<Record<string, BlogPost[]>>((acc, blog) => {
    blog.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      if (!acc[tag].find((b) => b.id === blog.id)) {
        acc[tag].push(blog);
      }
    });
    return acc;
  }, {});

  const toggleGroup = (tag: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(tag)) {
      newCollapsed.delete(tag);
    } else {
      newCollapsed.add(tag);
    }
    setCollapsedGroups(newCollapsed);
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedBlogs).map(([tag, tagBlogs]) => (
        <div key={tag} className="animate-fade-in">
          <button
            onClick={() => toggleGroup(tag)}
            className="flex items-center gap-3 mb-4 group"
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                collapsedGroups.has(tag) && '-rotate-90'
              )}
            />
            <Badge
              className={cn(
                'text-sm font-medium',
                tagColors[tag] || 'bg-muted text-muted-foreground'
              )}
            >
              {tag}
            </Badge>
            <span className="text-sm text-muted-foreground">{tagBlogs.length}</span>
          </button>

          {!collapsedGroups.has(tag) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 ml-7">
              {tagBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
