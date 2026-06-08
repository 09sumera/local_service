import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-indigo-700 transition-colors">
                L
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">LocalServe</span>
            </Link>
            
            <div className="hidden sm:flex sm:space-x-1">
              <Link 
                to="/services" 
                className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <Search size={18}/> Browse Services
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider' : '/profile'} 
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
