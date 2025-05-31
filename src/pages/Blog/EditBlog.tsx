import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";


const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const blog = location.state?.blog;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!blog) {
      toast.error('No blog data found. Redirecting...');
      navigate('/');
    } else {
      setTitle(blog.title || '');
      setContent(blog.content || '');
      setTags(blog.tags || '');
      setAuthor(blog.author || '');
    }
  }, [blog, navigate]);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/${blog.id}`,
        { title, content, tags, author },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Blog updated successfully!');
      navigate('/my-blogs');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdate();
  };


  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Blog Content"
          className="w-full border border-gray-300 p-2 rounded h-40"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="w-full border border-gray-300 p-2 rounded"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >

            {loading ? <div className='flex gap-1'><Loader color="border-white" /><span>Save Changes</span></div> : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-blogs")}
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

