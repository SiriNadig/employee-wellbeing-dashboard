import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Heart, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Users,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [theme, setTheme] = useState('light');

  // Auto-detect system theme
  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(systemDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', systemDark);
  }, []);

  // Apply theme on change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Mood', href: '/mood', icon: Heart },
    { name: 'Meetings', href: '/meetings', icon: Calendar },
    { name: 'Productivity', href: '/productivity', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-babyblue bg-opacity-40 dark:bg-dm-babyblue dark:bg-opacity-40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-cream dark:bg-dm-cream shadow-soft border-none rounded-2xl m-4 font-soft flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-bold text-lavender dark:text-dm-lavender tracking-wide">Well-Being</h2>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-mint dark:text-dm-mint hover:bg-babyblue dark:hover:bg-dm-babyblue transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-5 py-3 text-base font-semibold rounded-2xl transition-all duration-200 gap-3 font-soft ${
                    isActive(item.href)
                      ? 'bg-babyblue dark:bg-dm-babyblue text-lavender dark:text-dm-lavender shadow-soft'
                      : 'text-mint dark:text-dm-mint hover:bg-blush dark:hover:bg-dm-blush hover:text-dm-offblack'
                  }`}
                >
                  <span className={`w-10 h-10 flex items-center justify-center rounded-full bg-cream dark:bg-dm-cream shadow-soft mr-2`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 space-y-4">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 text-base font-semibold rounded-2xl bg-blush dark:bg-dm-blush text-dm-offblack hover:bg-babyblue dark:hover:bg-dm-babyblue shadow-soft transition-all duration-200 font-soft"
            >
              <LogOut className="h-6 w-6" />
              Logout
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-babyblue dark:bg-dm-babyblue rounded-full flex items-center justify-center shadow-soft">
                <Users className="h-5 w-5 text-lavender dark:text-dm-lavender" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-lavender dark:text-dm-lavender">Team</p>
                <p className="text-xs text-mint dark:text-dm-mint">View team insights</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
