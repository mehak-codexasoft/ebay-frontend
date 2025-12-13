import { Menu, Bell, Search, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header({ setIsOpen }) {
  const [showProfile, setShowProfile] = useState(false);

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

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@beway.com</p>
              </div>
              <ChevronDown size={16} className="hidden md:block text-gray-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Settings</a>
                <hr className="my-2 border-gray-100" />
                <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
