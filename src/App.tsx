import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import NotFound from './pages/NotFound';
import BlogList from './pages/Blog/BlogList';
import BlogDetail from './pages/Blog/BlogDetails';
import './App.css'
import CreateBlog from './pages/Blog/CreateBlog';
import MyBlogs from './pages/Blog/MyBlog';
import EditBlog from './pages/Blog/EditBlog';



function App() {

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      {/* Example blog routes */}
      <Route path="/" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/blog/create" element={<CreateBlog />} />
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/blog/edit/:id" element={<EditBlog />} />


      {/* Redirect root to login (or dashboard if logged in) */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
