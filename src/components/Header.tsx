import { useAuth } from '@/context/AuthProvider'
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import { toast } from 'react-hot-toast';



const Header = () => {


  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (option: string) => {
    switch (option) {
      case 'My Blog':
        navigate('/my-blogs');
        break;

      case 'Logout':
        // clear tokens or call logout API
        logout();
        toast.success("Logout Successfully.")
        navigate('/auth/login');
        break;
      default:
        console.log('No action for:', option);
    }
  };



  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyBlogApp
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">


          {!user ? (
            <>
              <Link to="/auth/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/auth/signup" className="text-gray-700 hover:text-blue-600">
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center">
              {/* <span className="text-gray-600">Hi, {user?.name}</span>
              <div className="flex items-center space-x-3">
              <Link to="/my-blogs" className="hover:text-blue-600">My Blogs</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div> */}

              <Dropdown
                options={['My Blog', 'Logout']}
                onSelect={handleSelect}
                placeholder={`Hi, ${user?.name}`}
              />
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
