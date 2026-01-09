import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost, ViewMode, SortOrder } from '@/types/blog';
import { sampleBlogs } from '@/data/sampleBlogs';

interface BlogStore {
  blogs: BlogPost[];
  viewMode: ViewMode;
  sortOrder: SortOrder;
  searchQuery: string;
  selectedTags: string[];
  setViewMode: (mode: ViewMode) => void;
  setSortOrder: (order: SortOrder) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  addBlog: (blog: BlogPost) => void;
  updateBlog: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  getBlogById: (id: string) => BlogPost | undefined;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      blogs: sampleBlogs,
      viewMode: 'grid',
      sortOrder: 'newest',
      searchQuery: '',
      selectedTags: [],
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
      updateBlog: (id, updates) =>
        set((state) => ({
          blogs: state.blogs.map((blog) =>
            blog.id === id ? { ...blog, ...updates } : blog
          ),
        })),
      deleteBlog: (id) =>
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== id),
        })),
      getBlogById: (id) => get().blogs.find((blog) => blog.id === id),
    }),
    {
      name: 'blog-storage',
    }
  )
);
