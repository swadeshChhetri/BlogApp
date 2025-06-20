// src/pages/Auth/Login.tsx
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthProvider';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from "../../api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
}

const Login = () => {
  // 1. State
  const [email, setEmail] = useState('swadesh321@gmail.com');
  const [password, setPassword] = useState('swadesh@321');
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
      const response = await api.post<LoginResponse>('/login', { email, password });
      login(response.data.token, response.data.user);
      toast.success('Login successful');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed');
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
