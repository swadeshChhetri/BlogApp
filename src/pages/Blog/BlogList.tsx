import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthProvider";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";


interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user: {
    name: string;
  };
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const blogsPerPage = 5;
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await api.get<Blog[]>('/blogs'); // Use your Axios instance
        setBlogs(response.data);

      } catch (err: any) {
        toast.error(err.message || 'Error fetching blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateClick = () => {
    if (token) {
      navigate("/blog/create");
    } else {
      navigate("/auth/login");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader color="border-blue-500" />
      </div>
    );
  }

  console.log("Loading:", loading);





  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Blogs</h1>
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Blog
        </button>
      </div>

      {/* {currentBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border rounded-lg shadow p-4 mb-4"
          >
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              by {blog.user?.name ?? "Unknown"} ·{" "}
              {new Date(blog.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-2">
              {blog.content.slice(0, 100)}...
            </p>
            <Link
              to={`/blog/${blog.id}`}
              className="text-blue-600 hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))
      )} */}

      {currentBlogs && Array.isArray(currentBlogs) && currentBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        currentBlogs && Array.isArray(currentBlogs) && currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border rounded-lg shadow p-4 mb-4"
          >
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              by {blog.user?.name ?? "Unknown"} ·{" "}
              {new Date(blog.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-2">
              {blog.content.slice(0, 100)}...
            </p>
            <Link to={`/blog/${blog.id}`} className="text-blue-500 hover:underline">
              Read More
            </Link>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded ${currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          Previous
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded ${currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;
