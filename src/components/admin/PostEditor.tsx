import { useEditor, EditorContent } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import { useEffect } from "react";
import { bodyDialectExtensions } from "@/lib/admin/extensions";

type Props = {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
  onTitleChange?: (title: string) => void;
};

export function PostEditor({ initialMarkdown, onChange, onTitleChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...bodyDialectExtensions(),
      Markdown.configure({
        markedOptions: { gfm: true },
      }),
    ],
    content: initialMarkdown,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class:
          "admin-tiptap prose prose-lg dark:prose-invert max-w-none min-h-[60vh] focus:outline-none px-1",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const markdown = ed.getMarkdown();
      onChange(markdown);
      const match = /^#\s+(.+)$/m.exec(markdown);
      if (match && onTitleChange) {
        onTitleChange(match[1]!.trim());
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getMarkdown();
    if (current.trimEnd() !== initialMarkdown.trimEnd()) {
      editor.commands.setContent(initialMarkdown, {
        contentType: "markdown",
      });
    }
  }, [editor, initialMarkdown]);

  if (!editor) {
    return (
      <p className="text-sm text-muted-foreground">Loading Live Preview…</p>
    );
  }

  return (
    <div className="rounded-sm border border-border bg-card/40 px-4 py-3">
      <EditorContent editor={editor} />
    </div>
  );
}
