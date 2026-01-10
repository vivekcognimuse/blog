import { useBlogStore } from '@/store/blogStore';
import { useBlogs } from '@/hooks/useBlogs';
import { BlogToolbar } from '@/components/blog/BlogToolbar';
import { BlogGrid, BlogGroupedView } from '@/components/blog/BlogGrid';
import { Button } from '@/components/ui/button';
import { Loader2, Settings } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, onAuthStateChange } from '@/lib/auth';

export default function BlogList() {
  const { data: blogs = [], isLoading } = useBlogs();
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    viewMode,
    sortOrder,
    searchQuery,
    setViewMode,
    setSortOrder,
    setSearchQuery,
  } = useBlogStore();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await getCurrentUser();
        setIsAdmin(!!user);
      } catch {
        setIsAdmin(false);
      }
    };
    
    // Check on mount
    checkAdmin();
    
    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setIsAdmin(!!user);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredAndSortedBlogs = useMemo(() => {
    let result = blogs.filter((blog) => blog.isPublished);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.description.toLowerCase().includes(query)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [blogs, searchQuery, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-3xl font-serif font-semibold text-foreground hover:text-foreground/80 transition-colors">
                My blog
              </h1>
            </Link>
            {isAdmin ? (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <BlogToolbar
          viewMode={viewMode}
          sortOrder={sortOrder}
          searchQuery={searchQuery}
          onViewModeChange={setViewMode}
          onSortOrderChange={setSortOrder}
          onSearchChange={setSearchQuery}
        />

        {filteredAndSortedBlogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No blogs found</p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <BlogGrid blogs={filteredAndSortedBlogs} />
        ) : (
          <BlogGroupedView blogs={filteredAndSortedBlogs} />
        )}
      </main>
    </div>
  );
}
