import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-babyblue dark:bg-dm-babyblue shadow-soft border-none rounded-2xl px-8 py-4 my-4 mx-2 font-soft transition-all duration-200">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-3 rounded-xl text-mint dark:text-dm-mint hover:bg-cream dark:hover:bg-dm-cream transition-all duration-200"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold text-lavender dark:text-dm-lavender tracking-wide">
            Employee Well-Being Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6 relative">
          {/* Notifications */}
          <button className="p-3 rounded-xl text-mint dark:text-dm-mint hover:bg-cream dark:hover:bg-dm-cream transition-all duration-200">
            <Bell className="h-6 w-6" />
          </button>

          {/* User menu (mobile only) */}
          <div className="relative md:hidden">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center space-x-2 p-3 rounded-xl text-mint dark:text-dm-mint font-semibold focus:outline-none"
            >
              <User className="h-6 w-6" />
              <span className="text-base font-semibold">
                {user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dm-cream rounded-xl shadow-lg z-50">
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-base font-semibold rounded-xl text-blush dark:text-dm-blush hover:bg-babyblue dark:hover:bg-dm-babyblue transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* User info (desktop only) */}
          <div className="hidden md:flex items-center space-x-2 p-3 rounded-xl text-mint dark:text-dm-mint font-semibold">
            <User className="h-6 w-6" />
            <span className="text-base font-semibold">
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
