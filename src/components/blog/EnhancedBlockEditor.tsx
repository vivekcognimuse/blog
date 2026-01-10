import { useState, useRef, useEffect, useCallback } from 'react';
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface EnhancedBlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode; keywords: string[] }[] = [
  { type: 'paragraph', label: 'Text', icon: <Type className="h-4 w-4" />, keywords: ['text', 'paragraph', 'p'] },
  { type: 'heading1', label: 'Heading 1', icon: <Heading1 className="h-4 w-4" />, keywords: ['h1', 'heading1', 'title'] },
  { type: 'heading2', label: 'Heading 2', icon: <Heading2 className="h-4 w-4" />, keywords: ['h2', 'heading2', 'subtitle'] },
  { type: 'heading3', label: 'Heading 3', icon: <Heading3 className="h-4 w-4" />, keywords: ['h3', 'heading3'] },
  { type: 'bulletList', label: 'Bullet List', icon: <List className="h-4 w-4" />, keywords: ['bullet', 'list', 'ul'] },
  { type: 'numberedList', label: 'Numbered List', icon: <ListOrdered className="h-4 w-4" />, keywords: ['numbered', 'ordered', 'ol'] },
  { type: 'quote', label: 'Quote', icon: <Quote className="h-4 w-4" />, keywords: ['quote', 'citation'] },
  { type: 'divider', label: 'Divider', icon: <Minus className="h-4 w-4" />, keywords: ['divider', 'hr', 'line'] },
  { type: 'callout', label: 'Callout', icon: <MessageSquare className="h-4 w-4" />, keywords: ['callout', 'note', 'tip'] },
  { type: 'code', label: 'Code', icon: <Code className="h-4 w-4" />, keywords: ['code', 'snippet'] },
  { type: 'image', label: 'Image', icon: <Image className="h-4 w-4" />, keywords: ['image', 'img', 'picture'] },
];

const commonEmojis = ['📝', '✨', '🎯', '💡', '🚀', '⭐', '🔥', '💪', '🎉', '📚', '🧘', '🍜', '☀️', '🧠', '🌟', '🌱', '💭', '⚡', '🌶️', '📖'];

export function EnhancedBlockEditor({ blocks, onChange, onImageUpload }: EnhancedBlockEditorProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [slashCommand, setSlashCommand] = useState<{ blockId: string; query: string } | null>(null);
  const slashInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    setSlashCommand(null);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      onChange(blocks.filter((b) => b.id !== id));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string, content: string) => {
    // Handle escape to close slash menu
    if (e.key === 'Escape' && slashCommand?.blockId === blockId) {
      e.preventDefault();
      setSlashCommand(null);
      updateBlock(blockId, { content: '' });
      return;
    }

    // Handle enter to select first option in slash menu
    if (e.key === 'Enter' && slashCommand?.blockId === blockId) {
      e.preventDefault();
      const filtered = blockTypes.filter(
        (bt) =>
          bt.keywords.some((kw) => kw.toLowerCase().includes(slashCommand.query.toLowerCase())) ||
          bt.label.toLowerCase().includes(slashCommand.query.toLowerCase())
      );
      if (filtered.length > 0) {
        updateBlock(blockId, { type: filtered[0].type, content: '' });
        setSlashCommand(null);
      }
      return;
    }

    // Handle backspace on empty block (only if not in slash command mode)
    if (e.key === 'Backspace' && content === '' && slashCommand?.blockId !== blockId && blocks.length > 1) {
      e.preventDefault();
      deleteBlock(blockId);
      // Focus previous block
      const index = blocks.findIndex((b) => b.id === blockId);
      if (index > 0) {
        setTimeout(() => setFocusedBlockId(blocks[index - 1].id), 100);
      }
      return;
    }

    // Let the input handle the rest
  };

  const filteredBlockTypes = slashCommand
    ? blockTypes.filter((bt) =>
        bt.keywords.some((kw) => kw.toLowerCase().includes(slashCommand.query.toLowerCase())) ||
        bt.label.toLowerCase().includes(slashCommand.query.toLowerCase())
      )
    : blockTypes;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isFocused={focusedBlockId === block.id}
              slashCommand={slashCommand?.blockId === block.id ? slashCommand.query : null}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onFocus={() => setFocusedBlockId(block.id)}
              onDelete={() => deleteBlock(block.id)}
              onAddBlock={(type) => addBlock(type, block.id)}
              onKeyDown={(e) => {
                handleKeyDown(e, block.id, block.content);
              }}
              onImageUpload={onImageUpload ? (file) => onImageUpload(file).then((url) => updateBlock(block.id, { imageUrl: url })).catch(console.error) : undefined}
              onSlashCommandSelect={(type) => {
                updateBlock(block.id, { type, content: '' });
                setSlashCommand(null);
              }}
            />
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Start writing your blog post</p>
              <p className="text-sm text-muted-foreground mb-4">Type <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd> to add blocks</p>
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
      </SortableContext>
    </DndContext>
  );
}

interface SortableBlockProps {
  block: Block;
  isFocused: boolean;
  slashCommand: string | null;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onDelete: () => void;
  onAddBlock: (type: BlockType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onImageUpload?: (file: File) => Promise<void>;
  onSlashCommandSelect: (type: BlockType) => void;
}

function SortableBlock({
  block,
  isFocused,
  slashCommand,
  onUpdate,
  onFocus,
  onDelete,
  onAddBlock,
  onKeyDown,
  onImageUpload,
  onSlashCommandSelect,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-start gap-2 p-2 rounded-lg transition-colors',
        isFocused && 'bg-muted/50',
        isDragging && 'z-50'
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
                onClick={() => onAddBlock(bt.type)}
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
          className="h-6 w-6 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 relative">
        {slashCommand !== null ? (
          <SlashCommandMenu
            query={slashCommand}
            onSelect={(type) => {
              onSlashCommandSelect(type);
            }}
            onClose={() => {
              onUpdate({ content: '' });
            }}
          />
        ) : null}
        <BlockInput
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
          onImageUpload={onImageUpload}
          onKeyDown={onKeyDown}
          onSlashCommand={(query) => {
            if (query === '/') {
              setSlashCommand({ blockId: block.id, query: '' });
            } else if (query.startsWith('/')) {
              setSlashCommand({ blockId: block.id, query: query.slice(1) });
            } else {
              setSlashCommand(null);
            }
          }}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SlashCommandMenu({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  const filtered = blockTypes.filter(
    (bt) =>
      bt.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase())) ||
      bt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="absolute top-0 left-0 z-50 bg-popover border border-border rounded-lg shadow-lg w-64 max-h-64 overflow-y-auto">
      <div className="p-1">
        {filtered.length > 0 ? (
          filtered.map((bt) => (
            <button
              key={bt.type}
              onClick={() => onSelect(bt.type)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
            >
              {bt.icon}
              <span>{bt.label}</span>
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">No blocks found</div>
        )}
      </div>
    </div>
  );
}

interface BlockInputProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onImageUpload?: (file: File) => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSlashCommand?: (query: string) => void;
}

function BlockInput({ block, onUpdate, onFocus, onImageUpload, onKeyDown, onSlashCommand }: BlockInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseClasses = 'w-full bg-transparent border-none focus:ring-0 focus-visible:ring-0 resize-none text-foreground';

  const handleChange = (value: string) => {
    onUpdate({ content: value });
    // Check for slash command
    if (onSlashCommand) {
      if (value === '/') {
        onSlashCommand('/');
      } else if (value.startsWith('/')) {
        onSlashCommand(value);
      } else {
        onSlashCommand('');
      }
    }
  };

  switch (block.type) {
    case 'heading1':
      return (
        <div className="flex items-center gap-2">
          <EmojiPicker
            emoji={block.emoji}
            onSelect={(emoji) => onUpdate({ emoji })}
          />
          <Input
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder="Heading 1"
            className={cn(baseClasses, 'text-3xl font-serif font-medium h-auto py-2')}
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
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder="Heading 2"
            className={cn(baseClasses, 'text-2xl font-serif font-medium h-auto py-2')}
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
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder="Heading 3"
            className={cn(baseClasses, 'text-xl font-serif font-medium h-auto py-2')}
          />
        </div>
      );

    case 'paragraph':
      return (
        <Textarea
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder="Type '/' for commands or start writing..."
          className={cn(baseClasses, 'text-lg min-h-[60px]')}
        />
      );

    case 'bulletList':
    case 'numberedList':
      return (
        <Textarea
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder="Enter items (one per line)"
          className={cn(baseClasses, 'text-lg min-h-[100px]')}
        />
      );

    case 'quote':
      return (
        <Textarea
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
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
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder="Callout content..."
            className={cn(baseClasses, 'bg-transparent min-h-[60px]')}
          />
        </div>
      );

    case 'code':
      return (
        <Textarea
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
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
              if (file && onImageUpload) {
                onImageUpload(file);
              }
            }}
          />
          <Input
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
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

