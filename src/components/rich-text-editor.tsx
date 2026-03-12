"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo, 
  ImageIcon 
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escreva aqui...",
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto border border-border/50 shadow-lg my-4",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[150px] p-4 focus:outline-none rich-text-content",
          className
        ),
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));

        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (src) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Sync value if changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50 backdrop-blur-sm sticky top-0 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("bold") && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("italic") && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("heading", { level: 1 }) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("heading", { level: 2 }) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("bulletList") && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("orderedList") && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-colors", 
            editor.isActive("codeBlock") && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary disabled:opacity-30 transition-colors"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary disabled:opacity-30 transition-colors"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        <EditorContent editor={editor} />
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
          .hljs-comment, .hljs-quote { color: #64748b; }
          .hljs-keyword, .hljs-selector-tag { color: #3b82f6; }
          .hljs-string, .hljs-doctag { color: #10b981; }
          .hljs-title, .hljs-section, .hljs-selector-id { color: #f59e0b; }
          .hljs-variable, .hljs-template-variable { color: #ef4444; }
          .rich-text-content .ProseMirror-placeholder {
            color: var(--muted-foreground);
            pointer-events: none;
            position: absolute;
            top: 1rem;
            left: 1rem;
          }
        `}</style>
      </div>
    </div>
  );
}
