import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags?: string[];
  authorName?: string;
  isAuthor?: boolean;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog');

        const data = await res.json();
        setBlog(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load blog');
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader color="border-blue-500" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-10 text-gray-500">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-2">
        by {blog.isAuthor ? 'You' : blog.authorName} on{' '}
        {new Date(blog.created_at).toLocaleDateString()}
      </p>
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="prose max-w-none mb-6">
        <p>{blog.content}</p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Back to Blogs
      </button>
    </div>
  );
};

export default BlogDetail;
