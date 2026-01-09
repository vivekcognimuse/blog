import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoverImageEditorProps {
  coverImage: string;
  onChange: (image: string) => void;
}

export function CoverImageEditor({ coverImage, onChange }: CoverImageEditorProps) {
  const [position, setPosition] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative w-full h-[300px] overflow-hidden rounded-t-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {coverImage ? (
        <>
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover transition-all duration-300"
            style={{ objectPosition: `center ${position}%` }}
          />
          <div
            className={cn(
              'absolute inset-0 bg-black/30 flex items-center justify-center gap-4 transition-opacity duration-200',
              isHovering ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Change cover
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPosition((p) => Math.max(0, p - 10))}
              className="gap-2"
            >
              <Move className="h-4 w-4" />
              Reposition
            </Button>
          </div>
        </>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full bg-muted flex flex-col items-center justify-center gap-3 hover:bg-muted/80 transition-colors"
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">Add a cover image</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
