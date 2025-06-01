import Loader from '@/components/Loader';
// import { useAuth } from '@/context/AuthProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import api from "../../api";

interface CreateBlogPayload {
  title: string;
  content: string;
  tags?: string;
  author?: string;
  }
  
  

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setLoading(true);

    const payload: CreateBlogPayload = {
      title: title,
      content: content,
      tags: tags,
      author: author,
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full border border-gray-300 p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          className="w-full border border-gray-300 p-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
