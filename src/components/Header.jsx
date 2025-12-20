import { Menu, Bell, Search, User, ChevronDown, Settings, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';

export default function Header({ setIsOpen }) {
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Still redirect even if logout API fails
      navigate('/');
    }
  };

  const handleNavigate = (path) => {
    setShowProfile(false);
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(/(?=[A-Z])/).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm shrink-0">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64 lg:w-80">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={20} className="text-gray-600" />
          </button>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {currentUser?.dp ? (
                <img
                  src={currentUser.dp}
                  alt={currentUser.nickname}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(currentUser?.nickname)}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{currentUser?.nickname || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'admin@beway.com'}</p>
              </div>
              <ChevronDown size={16} className={`hidden md:block text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {currentUser?.dp ? (
                      <img
                        src={currentUser.dp}
                        alt={currentUser.nickname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium">
                        {getInitials(currentUser?.nickname)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.nickname || 'Admin User'}</p>
                      <p className="text-xs text-gray-500 truncate">@{currentUser?.username || 'admin'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => handleNavigate('/settings')}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-gray-400" />
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigate('/settings')}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                    Settings
                  </button>
                </div>

                <hr className="my-1 border-gray-100" />

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
