"use client";

import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null;

  // Verifica se o conteúdo parece ser HTML (contém tags)
  const isHTML = /<[a-z][\s\S]*>/i.test(content);

  // Função simples para converter Markdown básico em HTML seguro para visualização
  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className={cn("relative", className)}>
      {isHTML ? (
        <div 
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div 
          className="rich-text-content whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
      )}
      <style jsx global>{`
        .rich-text-content {
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .rich-text-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
        }
        .rich-text-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
        }
        .rich-text-content p {
          margin-bottom: 0.75rem;
        }
        .rich-text-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-text-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-text-content blockquote {
          border-left: 4px solid var(--border);
          padding-left: 1rem;
          font-style: italic;
          margin-bottom: 0.75rem;
        }
        .rich-text-content code {
          background-color: rgba(var(--primary), 0.1);
          color: var(--primary);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .rich-text-content pre {
          background-color: #0f172a;
          color: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
        }
        .rich-text-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }
        .rich-text-content img {
          border-radius: 0.5rem;
          max-width: 100%;
          height: auto;
          margin-top: 1rem;
          margin-bottom: 1rem;
          border: 1px solid var(--border);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
}
