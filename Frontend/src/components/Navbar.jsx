import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="black-card p-4 sticky top-0 z-50 border-b border-yellow-500/20">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 yellow-gradient rounded-xl glow"></div>
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            TaskMaster
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link 
            to="/profile" 
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 p-2 rounded-xl transition-all"
          >
            <FaUser size={20} />
            <span>{user?.name}</span>
          </Link>
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 p-2 rounded-xl transition-all"
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;