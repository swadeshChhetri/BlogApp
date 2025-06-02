import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';
import toast from 'react-hot-toast';
import api from '../../api';
import Loader from '@/components/Loader';

interface Blog {
  id: number;
  title?: string;
  content?: string;
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

const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog as Blog;

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentHTML, setContentHTML] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      Placeholder.configure({
        placeholder: 'Update your blog content here...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContentHTML(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!blog) {
      toast.error('No blog data found. Redirecting...');
      navigate('/');
    } else {
      setTitle(blog.title || '');
      setTags(blog.tags || '');
      setAuthor(blog.author || '');
      setContentHTML(blog.content || '');

      if (editor) {
        editor.commands.setContent(blog.content || '');
      }
    }
  }, [blog, navigate, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !contentHTML.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setLoading(true);

    try {
      await api.put(`/blogs/${blog.id}`, {
        title,
        content: contentHTML,
        tags,
        author,
      });

      toast.success('Blog updated successfully!');
      navigate('/my-blogs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
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
            {loading ? <div className='flex gap-1'><Loader /><span>Save Changes</span></div> : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/my-blogs')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
