import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode, SortOrder } from '@/types/blog';

/**
 * BlogStore now only handles UI state (view preferences, filters, etc.)
 * Blog data is managed by React Query hooks (useBlogs, useBlog)
 */
interface BlogStore {
  viewMode: ViewMode;
  sortOrder: SortOrder;
  searchQuery: string;
  selectedTags: string[];
  setViewMode: (mode: ViewMode) => void;
  setSortOrder: (order: SortOrder) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      sortOrder: 'newest',
      searchQuery: '',
      selectedTags: [],
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
    }),
    {
      name: 'blog-ui-storage', // Changed name to avoid conflicts
    }
  )
);
