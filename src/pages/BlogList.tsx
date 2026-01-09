import { useBlogStore } from '@/store/blogStore';
import { BlogToolbar } from '@/components/blog/BlogToolbar';
import { BlogGrid, BlogGroupedView } from '@/components/blog/BlogGrid';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function BlogList() {
  const {
    blogs,
    viewMode,
    sortOrder,
    searchQuery,
    setViewMode,
    setSortOrder,
    setSearchQuery,
  } = useBlogStore();

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
