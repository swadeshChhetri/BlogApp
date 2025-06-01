// src/pages/Auth/Signup.tsx
import Loader from '@/components/Loader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api";

interface SignupResponse {
  message: string;
}

const Signup = () => {
  // 1. States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Hook
  const navigate = useNavigate();

  // 3. Event handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (!agree) {
      toast.error('You must agree to the terms');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<SignupResponse>('/register', {
        username: username,
        email: email,
        password: password,
      });

      toast.success(response.data.message || 'Registration successful!');
      navigate('/auth/login');
     } catch (error: any) {
      console.error('Error:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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

          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mr-2"
              required
            />
            I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Privacy Policy</a>
          </label>

          <button type="submit"
            disabled={loading}
            className="w-full h-10 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? <Loader /> : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/auth/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
