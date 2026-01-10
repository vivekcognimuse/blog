import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Move, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoverImageEditorProps {
  coverImage: string;
  position?: number;
  onChange: (image: string) => void;
  onPositionChange?: (position: number) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export function CoverImageEditor({ 
  coverImage, 
  position: externalPosition = 50,
  onChange, 
  onPositionChange,
  onImageUpload
}: CoverImageEditorProps) {
  const [position, setPosition] = useState(externalPosition);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with external position prop
  useEffect(() => {
    setPosition(externalPosition);
  }, [externalPosition]);

  const handlePositionChange = (newPosition: number) => {
    const clampedPosition = Math.max(0, Math.min(100, newPosition));
    setPosition(clampedPosition);
    onPositionChange?.(clampedPosition);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If onImageUpload is provided, upload to Supabase
    if (onImageUpload) {
      setIsUploading(true);
      try {
        const url = await onImageUpload(file);
        onChange(url);
      } catch (error) {
        console.error('Error uploading cover image:', error);
        // Fallback to base64 for preview if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploading(false);
      }
    } else {
      // Fallback to base64 if no upload handler
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
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Change cover'}
            </Button>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePositionChange(position - 10)}
                className="gap-2"
                title="Move image up"
              >
                <ArrowUp className="h-4 w-4" />
                Up
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePositionChange(position + 10)}
                className="gap-2"
                title="Move image down"
              >
                <ArrowDown className="h-4 w-4" />
                Down
              </Button>
            </div>
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
