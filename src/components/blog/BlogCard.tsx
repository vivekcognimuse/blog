import { BlogPost } from '@/types/blog';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  blog: BlogPost;
  isAdmin?: boolean;
}

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

export function BlogCard({ blog, isAdmin = false }: BlogCardProps) {
  const linkPath = isAdmin ? `/admin/edit/${blog.id}` : `/blog/${blog.id}`;

  return (
    <Link
      to={linkPath}
      className="group block animate-fade-in"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[30%] opacity-90"
        />
        <div className="absolute inset-0 bg-foreground/10" />
      </div>
      <div>
        <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {blog.title}
        </h3>
        <p className="text-xs text-muted-foreground font-sans">
          {format(new Date(blog.publishedDate), 'MMMM d, yyyy')}
        </p>
      </div>
    </Link>
  );
}
