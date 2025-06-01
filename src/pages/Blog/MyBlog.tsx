import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import api from "../../api";

interface Blog {
  id: number;
  title: string;
  content: string;
}

const MyBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const response = await api.get<Blog[]>('/my-blogs');
        setBlogs(response.data);
      } catch (error: any) {
        toast.error(error?.message || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader color="border-blue-500" />
      </div>
    );
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Something went wrong while deleting.");
    }
  }


  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <Link
          to="/blog/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs yet. Go ahead and create one!</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-3">
                {blog.content.slice(0, 150)}...
              </p>

              <div className="flex gap-3 mt-6">
                <Link
                  to={`/blog/edit/${blog.id}`}
                  state={{ blog }}
                  className="inline-block bg-blue-200 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(blog.id)}
                  className="inline-block bg-red-200 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );

  // function handleDelete(id: number) {
  //   if (confirm("Are you sure you want to delete this blog?")) {
  //     setBlogs((prev) => prev.filter((b) => b.id !== id));
  //     // Optionally send DELETE request here
  //   }
  // }
};

export default MyBlogs;

