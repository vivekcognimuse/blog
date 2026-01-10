import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog, useCreateBlog, useUpdateBlog, useDeleteBlog, useUploadImage } from '@/hooks/useBlogs';
import { blocksToBlockNote, blockNoteToBlocks } from '@/lib/api/blogs';
import { Block } from '@/types/blog';
import { EnhancedBlockEditor } from '@/components/blog/EnhancedBlockEditor';
import { CoverImageEditor } from '@/components/blog/CoverImageEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { allTags } from '@/data/sampleBlogs';
import coverMindfulness from '@/assets/cover-mindfulness.jpg';

const commonEmojis = ['📝', '✨', '🎯', '💡', '🚀', '⭐', '🔥', '💪', '🎉', '📚', '🧘', '🍜', '☀️', '🧠', '🌟', '🌱', '💭', '⚡', '🌶️', '📖'];

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  
  // React Query hooks
  const { data: existingBlog, isLoading: isLoadingBlog } = useBlog(isNew ? undefined : id);
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  const uploadImageMutation = useUploadImage();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [coverImage, setCoverImage] = useState(coverMindfulness);
  const [tags, setTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [coverImagePosition, setCoverImagePosition] = useState(50);

  // Load existing blog data
  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title);
      setDescription(existingBlog.description);
      setEmoji(existingBlog.emoji);
      setCoverImage(existingBlog.coverImage);
      // Reset position when loading existing blog (default to 50%)
      setCoverImagePosition(50);
      setTags(existingBlog.tags);
      // Convert blocks to our Block format
      if (existingBlog.blocks && Array.isArray(existingBlog.blocks)) {
        // If blocks are in BlockNote format (from Supabase), convert them
        if (existingBlog.blocks.length > 0 && 'type' in existingBlog.blocks[0]) {
          const blockNoteBlocks = existingBlog.blocks as any[];
          setBlocks(blockNoteToBlocks(blockNoteBlocks));
        } else {
          // Already in Block format
          setBlocks(existingBlog.blocks as Block[]);
        }
      } else {
        // Initialize with empty paragraph
        setBlocks([
          {
            id: `block-${Date.now()}`,
            type: 'paragraph',
            content: '',
          },
        ]);
      }
    } else if (isNew) {
      // Initialize with empty paragraph for new blog
      setBlocks([
        {
          id: `block-${Date.now()}`,
          type: 'paragraph',
          content: '',
        },
      ]);
    }
  }, [existingBlog, isNew]);


  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (isNew) {
        await createBlogMutation.mutateAsync({
          title,
          description,
          emoji,
          coverImage,
          tags,
          blocks: blocksToBlockNote(blocks) as any,
          isPublished: true,
        });
      } else if (existingBlog) {
        await updateBlogMutation.mutateAsync({
          id: existingBlog.id,
          updates: {
            title,
            description,
            emoji,
            coverImage,
            tags,
            blocks: blocksToBlockNote(blocks) as any,
          },
        });
      }
      navigate('/admin');
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleDelete = async () => {
    if (existingBlog) {
      try {
        await deleteBlogMutation.mutateAsync(existingBlog.id);
        navigate('/admin');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const url = await uploadImageMutation.mutateAsync({
        file,
        blogId: existingBlog?.id,
      });
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  if (isLoadingBlog && !isNew) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                if (existingBlog) {
                  // Open preview in new tab
                  window.open(`/blog/${existingBlog.id}`, '_blank');
                } else {
                  // For new blogs, save first then preview
                  if (!title.trim()) {
                    toast.error('Please enter a title first');
                    return;
                  }
                  
                  try {
                    const savedBlog = await createBlogMutation.mutateAsync({
                      title,
                      description,
                      emoji,
                      coverImage,
                      tags,
                      blocks: blocksToBlockNote(blocks) as any,
                      isPublished: true,
                    });
                    
                    // Open preview in new tab after saving
                    window.open(`/blog/${savedBlog.id}`, '_blank');
                    toast.success('Blog saved and opened in preview');
                  } catch (error) {
                    console.error('Error saving blog for preview:', error);
                    toast.error('Failed to save blog. Please try again.');
                  }
                }
              }}
              className="gap-2"
              disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            
            {existingBlog && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this blog post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your blog post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button 
              onClick={handleSave} 
              className="gap-2"
              disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
            >
              {createBlogMutation.isPending || updateBlogMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <CoverImageEditor 
        coverImage={coverImage} 
        position={coverImagePosition}
        onChange={setCoverImage}
        onPositionChange={setCoverImagePosition}
      />

      {/* Content */}
      <main className="container max-w-4xl py-8">
        {/* Emoji & Title */}
        <div className="mb-6">
          <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="text-6xl h-20 w-20 p-0 hover:bg-muted mb-4"
              >
                {emoji}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="grid grid-cols-5 gap-1">
                {commonEmojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setEmoji(e);
                      setEmojiPickerOpen(false);
                    }}
                    className="h-8 w-8 text-lg hover:bg-muted rounded flex items-center justify-center transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-5xl font-serif font-semibold border-none bg-transparent focus-visible:ring-0 px-0 h-auto py-2 text-foreground placeholder:text-muted-foreground/50"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="text-lg text-foreground/80 border-none bg-transparent focus-visible:ring-0 px-0 resize-none min-h-[60px] placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 gap-1 text-muted-foreground">
                  <Plus className="h-3 w-3" />
                  Add tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="start">
                <div className="space-y-2">
                  {allTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="block w-full text-left px-2 py-1 text-sm rounded hover:bg-muted transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  <div className="border-t pt-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTag(newTag);
                        }
                      }}
                      placeholder="Custom tag..."
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Enhanced Block Editor */}
        <div className="min-h-[500px] mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Content</h3>
            <div className="text-sm text-muted-foreground flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd>
                <span>Add block</span>
              </span>
              <span className="text-xs">Drag blocks to reorder</span>
            </div>
          </div>
          <EnhancedBlockEditor
            blocks={blocks}
            onChange={(newBlocks) => {
              setBlocks(newBlocks);
            }}
            onImageUpload={handleImageUpload}
          />
        </div>
      </main>
    </div>
  );
}
