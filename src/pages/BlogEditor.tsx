import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogStore } from '@/store/blogStore';
import { Block, BlogPost } from '@/types/blog';
import { BlockEditor } from '@/components/blog/BlockEditor';
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
  Smile,
  X,
  Plus,
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
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from 'sonner';
import { allTags } from '@/data/sampleBlogs';
import coverMindfulness from '@/assets/cover-mindfulness.jpg';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, addBlog, updateBlog, deleteBlog } = useBlogStore();

  const isNew = !id || id === 'new';
  const existingBlog = id && id !== 'new' ? getBlogById(id) : null;

  const [title, setTitle] = useState(existingBlog?.title || '');
  const [description, setDescription] = useState(existingBlog?.description || '');
  const [emoji, setEmoji] = useState(existingBlog?.emoji || '📝');
  const [coverImage, setCoverImage] = useState(existingBlog?.coverImage || coverMindfulness);
  const [tags, setTags] = useState<string[]>(existingBlog?.tags || []);
  const [blocks, setBlocks] = useState<Block[]>(
    existingBlog?.blocks || [
      { id: 'initial', type: 'heading1', content: '', emoji: '📝' },
      { id: 'initial-2', type: 'paragraph', content: '' },
    ]
  );
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const blogData: BlogPost = {
      id: existingBlog?.id || `blog-${Date.now()}`,
      title,
      description,
      emoji,
      coverImage,
      tags,
      publishedDate: existingBlog?.publishedDate || new Date().toISOString().split('T')[0],
      blocks,
      isPublished: true,
    };

    if (isNew || !existingBlog) {
      addBlog(blogData);
      toast.success('Blog post created!');
    } else {
      updateBlog(existingBlog.id, blogData);
      toast.success('Blog post updated!');
    }

    navigate('/admin');
  };

  const handleDelete = () => {
    if (existingBlog) {
      deleteBlog(existingBlog.id);
      toast.success('Blog post deleted');
      navigate('/admin');
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
              onClick={() => navigate(`/blog/${existingBlog?.id || 'preview'}`)}
              className="gap-2"
              disabled={isNew && !existingBlog}
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

            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <CoverImageEditor coverImage={coverImage} onChange={setCoverImage} />

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
            <PopoverContent className="w-auto p-0 border-none" align="start">
              <Picker
                data={data}
                onEmojiSelect={(e: { native: string }) => {
                  setEmoji(e.native);
                  setEmojiPickerOpen(false);
                }}
                theme="light"
              />
            </PopoverContent>
          </Popover>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-5xl font-serif font-semibold border-none bg-transparent focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-muted-foreground/50"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="text-lg text-muted-foreground border-none bg-transparent focus-visible:ring-0 px-0 resize-none min-h-[60px] placeholder:text-muted-foreground/50"
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

        {/* Block Editor */}
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </main>
    </div>
  );
}
