import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

interface BlogEditorProps {
  content: string;
  setContent: (value: string) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 p-2 rounded space-y-2">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">
          Bullet List
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn">
          Numbered List
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} className="btn">
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} className="btn">
          Redo
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
};

export default BlogEditor;
