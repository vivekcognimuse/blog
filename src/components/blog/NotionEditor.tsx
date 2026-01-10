import { useEffect, useMemo, useRef } from 'react';
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import './notion-editor.css';

interface NotionEditorProps {
  initialContent?: PartialBlock[];
  onChange?: (blocks: PartialBlock[]) => void;
  editable?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

export function NotionEditor({
  initialContent,
  onChange,
  editable = true,
  onImageUpload,
}: NotionEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const lastInitialContentRef = useRef<string>('');

  // Create editor instance - only create once with initial content
  const editor = useMemo(() => {
    const defaultContent = initialContent && initialContent.length > 0 
      ? initialContent 
      : [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '',
                styles: {},
              },
            ],
          },
        ];

    const newEditor = new BlockNoteEditor({
      initialContent: defaultContent,
      editable,
      uploadFile: onImageUpload
        ? async (file: File) => {
            try {
              const url = await onImageUpload(file);
              return url;
            } catch (error) {
              console.error('Image upload failed:', error);
              throw error;
            }
          }
        : undefined,
    });

    // Store initial content reference
    lastInitialContentRef.current = JSON.stringify(defaultContent);

    return newEditor;
  }, []); // Only create once

  // Mount editor to DOM
  useEffect(() => {
    if (!editorContainerRef.current) return;

    // Wait for editor to be ready
    const mountEditor = () => {
      if (!editorContainerRef.current) return;

      try {
        // Clear container
        editorContainerRef.current.innerHTML = '';

        // Get the editor's DOM element
        const editorDOM = editor._tiptapEditor?.view?.dom;
        if (editorDOM) {
          editorContainerRef.current.appendChild(editorDOM);
        } else if (editor.domElement) {
          editorContainerRef.current.appendChild(editor.domElement);
        } else {
          console.warn('BlockNote editor DOM element not found');
        }
      } catch (error) {
        console.error('Error mounting editor:', error);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      mountEditor();
    });
  }, [editor]);

  // Subscribe to content changes
  useEffect(() => {
    if (!onChange) return;

    const handleChange = () => {
      try {
        onChange(editor.topLevelBlocks);
      } catch (error) {
        console.error('Error in onChange:', error);
      }
    };

    editor.onChange(handleChange);

    return () => {
      // Cleanup if needed
    };
  }, [editor, onChange]);

  // Update editor content when initialContent changes (but skip initial mount)
  useEffect(() => {
    // Skip on initial mount - editor already has initial content
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if initialContent actually changed and is valid
    if (initialContent && Array.isArray(initialContent) && initialContent.length > 0) {
      const newContentStr = JSON.stringify(initialContent);
      
      if (newContentStr !== lastInitialContentRef.current) {
        // Wait for editor to be ready before updating
        setTimeout(() => {
          try {
            if (editor._tiptapEditor && !editor._tiptapEditor.isDestroyed) {
              // Validate blocks before replacing - ensure they have proper structure
              const validBlocks = initialContent.filter(block => {
                if (!block || typeof block !== 'object') return false;
                if (!('type' in block) || !block.type) return false;
                // Ensure content is an array if present
                if ('content' in block && !Array.isArray(block.content)) return false;
                return true;
              });
              
              if (validBlocks.length > 0) {
                editor.replaceBlocks(editor.topLevelBlocks, validBlocks);
                lastInitialContentRef.current = newContentStr;
              }
            }
          } catch (error) {
            console.error('Error updating editor content:', error);
          }
        }, 100);
      }
    }
  }, [editor, initialContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (editor._tiptapEditor && !editor._tiptapEditor.isDestroyed) {
          editor._tiptapEditor.destroy();
        }
      } catch (error) {
        console.error('Error destroying editor:', error);
      }
    };
  }, [editor]);

  return (
    <div className="notion-editor-wrapper min-h-[400px] py-8 relative">
      <div 
        ref={editorContainerRef} 
        className="blocknote-editor-container w-full"
        style={{ minHeight: '400px' }}
      />
      {editable && (
        <div className="absolute top-0 right-0 text-xs text-muted-foreground/60 p-2 bg-background/50 rounded pointer-events-none z-10">
          💡 Tip: Type <kbd className="px-1 py-0.5 bg-muted rounded text-xs">/</kbd> to add blocks
        </div>
      )}
    </div>
  );
}

