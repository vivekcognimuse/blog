import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBlogStore } from '@/store/blogStore';
import { BlogCard } from '@/components/blog/BlogCard';
import { ArrowRight, Pen } from 'lucide-react';

export default function Index() {
  const { blogs } = useBlogStore();
  const recentBlogs = blogs.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="container py-16 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold text-foreground mb-6 animate-fade-in">
          My blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
          Thoughts, stories, and ideas about life, learning, and everything in between.
        </p>
        <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/blog">
            <Button size="lg" className="gap-2">
              Read the blog
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/admin">
            <Button size="lg" variant="outline" className="gap-2">
              <Pen className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Recent Posts */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground">Recent posts</h2>
          <Link to="/blog">
            <Button variant="ghost" className="gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {recentBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          Built with ❤️ using Lovable
        </p>
      </footer>
    </div>
  );
}
