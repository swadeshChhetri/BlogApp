// src/pages/Auth/Login.tsx
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthProvider';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';



const Login = () => {
  // 1. State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false); // if not used, remove

  // 2. Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3. Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      login(data.token, data.user);
      toast.success('Login successful');
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                className="mr-2"
              />
              Keep me logged in
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loader}
            className="w-full h-10 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loader ? <Loader /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account? <Link to="/auth/signup" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
