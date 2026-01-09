import { useState, useRef } from 'react';
import { Block, BlockType } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  MessageSquare,
  Code,
  Image,
  Trash2,
  GripVertical,
  Smile,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'paragraph', label: 'Text', icon: <Type className="h-4 w-4" /> },
  { type: 'heading1', label: 'Heading 1', icon: <Heading1 className="h-4 w-4" /> },
  { type: 'heading2', label: 'Heading 2', icon: <Heading2 className="h-4 w-4" /> },
  { type: 'heading3', label: 'Heading 3', icon: <Heading3 className="h-4 w-4" /> },
  { type: 'bulletList', label: 'Bullet List', icon: <List className="h-4 w-4" /> },
  { type: 'numberedList', label: 'Numbered List', icon: <ListOrdered className="h-4 w-4" /> },
  { type: 'quote', label: 'Quote', icon: <Quote className="h-4 w-4" /> },
  { type: 'divider', label: 'Divider', icon: <Minus className="h-4 w-4" /> },
  { type: 'callout', label: 'Callout', icon: <MessageSquare className="h-4 w-4" /> },
  { type: 'code', label: 'Code', icon: <Code className="h-4 w-4" /> },
  { type: 'image', label: 'Image', icon: <Image className="h-4 w-4" /> },
];

const commonEmojis = ['📝', '✨', '🎯', '💡', '🚀', '⭐', '🔥', '💪', '🎉', '📚', '🧘', '🍜', '☀️', '🧠', '🌟', '🌱', '💭', '⚡', '🌶️', '📖'];

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addBlock = (type: BlockType, afterId?: string) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: '',
      emoji: type === 'callout' ? '💡' : undefined,
    };

    if (afterId) {
      const index = blocks.findIndex((b) => b.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    } else {
      onChange([...blocks, newBlock]);
    }

    setTimeout(() => setFocusedBlockId(newBlock.id), 100);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      onChange(blocks.filter((b) => b.id !== id));
    }
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateBlock(id, { imageUrl: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {blocks.map((block) => (
        <div
          key={block.id}
          className={cn(
            'group relative flex items-start gap-2 p-2 rounded-lg transition-colors',
            focusedBlockId === block.id && 'bg-muted/50'
          )}
        >
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {blockTypes.map((bt) => (
                  <DropdownMenuItem
                    key={bt.type}
                    onClick={() => addBlock(bt.type, block.id)}
                    className="gap-2"
                  >
                    {bt.icon}
                    {bt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-grab"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <BlockInput
              block={block}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onFocus={() => setFocusedBlockId(block.id)}
              onImageUpload={(file) => handleImageUpload(block.id, file)}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            onClick={() => deleteBlock(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {blocks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Start writing your blog post</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {blockTypes.map((bt) => (
                <DropdownMenuItem
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className="gap-2"
                >
                  {bt.icon}
                  {bt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

interface BlockInputProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onImageUpload: (file: File) => void;
}

function BlockInput({ block, onUpdate, onFocus, onImageUpload }: BlockInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseClasses = 'w-full bg-transparent border-none focus:ring-0 focus-visible:ring-0 resize-none';

  switch (block.type) {
    case 'heading1':
      return (
        <div className="flex items-center gap-2">
          <EmojiPicker
            emoji={block.emoji}
            onSelect={(emoji) => onUpdate({ emoji })}
          />
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onFocus={onFocus}
            placeholder="Heading 1"
            className={cn(baseClasses, 'text-3xl font-serif font-semibold h-auto py-2')}
          />
        </div>
      );

    case 'heading2':
      return (
        <div className="flex items-center gap-2">
          <EmojiPicker
            emoji={block.emoji}
            onSelect={(emoji) => onUpdate({ emoji })}
          />
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onFocus={onFocus}
            placeholder="Heading 2"
            className={cn(baseClasses, 'text-2xl font-serif font-semibold h-auto py-2')}
          />
        </div>
      );

    case 'heading3':
      return (
        <div className="flex items-center gap-2">
          <EmojiPicker
            emoji={block.emoji}
            onSelect={(emoji) => onUpdate({ emoji })}
          />
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onFocus={onFocus}
            placeholder="Heading 3"
            className={cn(baseClasses, 'text-xl font-serif font-medium h-auto py-2')}
          />
        </div>
      );

    case 'paragraph':
      return (
        <Textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onFocus={onFocus}
          placeholder="Type your text here..."
          className={cn(baseClasses, 'text-lg min-h-[60px]')}
        />
      );

    case 'bulletList':
    case 'numberedList':
      return (
        <Textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onFocus={onFocus}
          placeholder="Enter items (one per line)"
          className={cn(baseClasses, 'text-lg min-h-[100px]')}
        />
      );

    case 'quote':
      return (
        <Textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onFocus={onFocus}
          placeholder="Enter quote..."
          className={cn(baseClasses, 'text-xl font-serif italic border-l-4 border-secondary pl-4 min-h-[60px]')}
        />
      );

    case 'divider':
      return <hr className="my-4 border-border" />;

    case 'callout':
      return (
        <div className="flex items-start gap-2 bg-muted rounded-lg p-3">
          <EmojiPicker
            emoji={block.emoji}
            onSelect={(emoji) => onUpdate({ emoji })}
          />
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onFocus={onFocus}
            placeholder="Callout content..."
            className={cn(baseClasses, 'bg-transparent min-h-[60px]')}
          />
        </div>
      );

    case 'code':
      return (
        <Textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onFocus={onFocus}
          placeholder="Enter code..."
          className={cn(baseClasses, 'font-mono text-sm bg-muted rounded-lg p-3 min-h-[100px]')}
        />
      );

    case 'image':
      return (
        <div className="space-y-2">
          {block.imageUrl ? (
            <div className="relative group/img">
              <img
                src={block.imageUrl}
                alt={block.content || 'Uploaded image'}
                className="rounded-lg max-h-[400px] object-cover w-full"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                Change
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 flex flex-col items-center justify-center gap-2 border-dashed"
            >
              <Image className="h-8 w-8 text-muted-foreground" />
              <span className="text-muted-foreground">Click to upload image</span>
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(file);
            }}
          />
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onFocus={onFocus}
            placeholder="Image caption (optional)"
            className="text-sm"
          />
        </div>
      );

    default:
      return null;
  }
}

interface EmojiPickerProps {
  emoji?: string;
  onSelect: (emoji: string) => void;
}

function EmojiPicker({ emoji, onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-lg hover:bg-muted"
        >
          {emoji || <Smile className="h-4 w-4 text-muted-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-5 gap-1">
          {commonEmojis.map((e) => (
            <button
              key={e}
              onClick={() => {
                onSelect(e);
                setOpen(false);
              }}
              className="h-8 w-8 text-lg hover:bg-muted rounded flex items-center justify-center transition-colors"
            >
              {e}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
