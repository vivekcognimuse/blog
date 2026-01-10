import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
} from '@/lib/api/blogs';
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';

// Query keys
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: string) => [...blogKeys.lists(), { filters }] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

// Fetch all blogs
export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single blog
export function useBlog(id: string | undefined) {
  return useQuery({
    queryKey: blogKeys.detail(id || ''),
    queryFn: () => fetchBlogById(id!),
    enabled: !!id,
  });
}

// Create blog mutation
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog: Omit<BlogPost, 'id' | 'publishedDate'>) => createBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success('Blog post created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create blog: ${error.message}`);
    },
  });
}

// Update blog mutation
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BlogPost> }) =>
      updateBlog(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(data.id) });
      toast.success('Blog post updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update blog: ${error.message}`);
    },
  });
}

// Delete blog mutation
export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success('Blog post deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete blog: ${error.message}`);
    },
  });
}

// Upload image mutation
export function useUploadImage() {
  return useMutation({
    mutationFn: ({ file, blogId }: { file: File; blogId?: string }) =>
      uploadImage(file, blogId),
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`);
    },
  });
}

