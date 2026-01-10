import { useEffect, useRef, useState } from 'react';
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import './notion-editor.css';

interface BlockNoteRendererProps {
  blocks: PartialBlock[];
}

/**
 * Renders BlockNote content in read-only mode with custom styling
 */
export function BlockNoteRenderer({ blocks }: BlockNoteRendererProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let currentEditor: BlockNoteEditor | null = null;

    const initEditor = async () => {
      try {
        // Ensure blocks is a valid array
        const validBlocks = Array.isArray(blocks) && blocks.length > 0 
          ? blocks 
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
          initialContent: validBlocks,
          editable: false, // Read-only for rendering
        });

        if (!mounted) {
          newEditor._tiptapEditor?.destroy();
          return;
        }

        currentEditor = newEditor;
        setEditor(newEditor);

        // Mount editor to DOM - wait a bit for editor to be ready
        setTimeout(() => {
          if (editorContainerRef.current && newEditor && mounted) {
            try {
              editorContainerRef.current.innerHTML = '';
              
              // Get the editor's DOM element
              const editorDOM = newEditor._tiptapEditor?.view?.dom;
              
              if (editorDOM && editorDOM instanceof Node) {
                editorContainerRef.current.appendChild(editorDOM);
                setIsLoading(false);
              } else {
                console.warn('BlockNote editor DOM element not found or invalid');
                setIsLoading(false);
              }
            } catch (error) {
              console.error('Error mounting BlockNote editor:', error);
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        }, 100);
      } catch (error) {
        console.error('Error initializing BlockNote editor:', error);
        setIsLoading(false);
      }
    };

    initEditor();

    return () => {
      mounted = false;
      if (currentEditor) {
        try {
          currentEditor._tiptapEditor?.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, []); // Only initialize once

  // Update content when blocks change
  useEffect(() => {
    if (editor && blocks && Array.isArray(blocks) && blocks.length > 0) {
      try {
        const currentBlocks = editor.topLevelBlocks;
        const currentContentStr = JSON.stringify(currentBlocks);
        const newContentStr = JSON.stringify(blocks);
        
        // Only update if content actually changed
        if (currentContentStr !== newContentStr) {
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
        }
      } catch (error) {
        console.error('Error updating editor content:', error);
      }
    }
  }, [editor, blocks]);

  if (isLoading) {
    return (
      <div className="blog-content">
        <div className="text-muted-foreground text-center py-8">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="blog-content">
      <div ref={editorContainerRef} className="w-full" />
    </div>
  );
}

