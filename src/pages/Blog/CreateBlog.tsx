import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import api from "../../api";
import Loader from '@/components/Loader';

interface CreateBlogPayload {
  title: string;
  content: string;
  tags?: string;
  author?: string;
}

const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="mb-2 border-b pb-2 flex flex-wrap gap-2">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200 rounded px-2 py-1' : 'px-2 py-1'}>
        Bold
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200 rounded px-2 py-1' : 'px-2 py-1'}>
        Italic
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 rounded px-2 py-1' : 'px-2 py-1'}>
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200 rounded px-2 py-1' : 'px-2 py-1'}>
        Bullet List
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200 rounded px-2 py-1' : 'px-2 py-1'}>
        Ordered List
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt('Enter the URL');
          if (url) {
            if (editor.state.selection.empty) {
              editor.chain().focus().insertContent(`<a href="${url}" target="_blank">${url}</a>`).run();
            } else {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }
        }}
        className={editor.isActive('link') ? 'bg-gray-200 rounded px-2 py-1' : 'px-2 py-1'}
      >
        Link
      </button>
    </div>
  );
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [contentHTML, setContentHTML] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContentHTML(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !contentHTML.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setLoading(true);

    const payload: CreateBlogPayload = {
      title,
      content: contentHTML,
      tags,
      author,
    };

    try {
      await api.post('/blogs', payload);
      toast.success('Blog created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full border border-gray-300 p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <EditorToolbar editor={editor} />
        <EditorContent
          editor={editor}
          className="border border-gray-300 rounded p-2 h-60 overflow-y-auto ProseMirror"
        />

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          className="w-full border border-gray-300 p-2 rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author (optional)"
          className="w-full border border-gray-300 p-2 rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <div className='flex gap-1'><Loader /><span>Publish</span></div> : 'Publish'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;