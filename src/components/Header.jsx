import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();

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
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="p-3 rounded-xl text-mint dark:text-dm-mint hover:bg-cream dark:hover:bg-dm-cream transition-all duration-200">
            <Bell className="h-6 w-6" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-3 rounded-xl text-mint dark:text-dm-mint hover:bg-cream dark:hover:bg-dm-cream transition-all duration-200">
              <User className="h-6 w-6" />
              <span className="hidden md:block text-base font-semibold">
                {user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-52 bg-babyblue dark:bg-dm-babyblue rounded-2xl shadow-soft py-2 z-10 border-none">
              <button
                onClick={signOut}
                className="block w-full text-left px-6 py-3 text-base text-mint dark:text-dm-mint hover:bg-cream dark:hover:bg-dm-cream rounded-xl transition-all duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
