import { Block } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'heading1':
      return (
        <h1 className="text-4xl font-serif font-semibold mb-6 mt-8 flex items-center gap-3">
          {block.emoji && <span className="text-3xl">{block.emoji}</span>}
          {block.content}
        </h1>
      );

    case 'heading2':
      return (
        <h2 className="text-2xl font-serif font-semibold mb-4 mt-6 flex items-center gap-2">
          {block.emoji && <span className="text-xl">{block.emoji}</span>}
          {block.content}
        </h2>
      );

    case 'heading3':
      return (
        <h3 className="text-xl font-serif font-medium mb-3 mt-5 flex items-center gap-2">
          {block.emoji && <span className="text-lg">{block.emoji}</span>}
          {block.content}
        </h3>
      );

    case 'paragraph':
      return (
        <p className="text-lg leading-relaxed mb-4 font-sans text-foreground/90">
          {block.content.split('**').map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </p>
      );

    case 'bulletList':
      return (
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {block.content.split('\n').map((item, i) => (
            <li key={i} className="text-lg leading-relaxed font-sans text-foreground/90">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'numberedList':
      return (
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          {block.content.split('\n').map((item, i) => (
            <li key={i} className="text-lg leading-relaxed font-sans text-foreground/90">
              {item}
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-secondary pl-6 py-2 my-6 italic text-muted-foreground font-serif text-xl">
          {block.content}
        </blockquote>
      );

    case 'divider':
      return <hr className="my-8 border-border" />;

    case 'callout':
      return (
        <div className="bg-muted rounded-lg p-4 my-4 flex items-start gap-3">
          {block.emoji && <span className="text-xl">{block.emoji}</span>}
          <p className="text-foreground/90 font-sans">{block.content}</p>
        </div>
      );

    case 'code':
      return (
        <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4">
          <code className="text-sm font-mono text-foreground">{block.content}</code>
        </pre>
      );

    case 'image':
      return (
        <figure className="my-6">
          <img
            src={block.imageUrl}
            alt={block.content || 'Blog image'}
            className="rounded-lg w-full object-cover"
          />
          {block.content && (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">
              {block.content}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
