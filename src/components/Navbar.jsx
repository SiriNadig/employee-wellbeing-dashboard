import { Link, useLocation } from 'react-router-dom';
// import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const location = useLocation();

  const handleLogout = async () => {
    // await supabase.auth.signOut();
    // For demo mode, just reload the page
    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between bg-babyblue dark:bg-dm-babyblue shadow-soft rounded-2xl px-8 py-4 my-4 mx-2 font-soft transition-all duration-200">
      <div className="font-bold text-2xl text-lavender dark:text-dm-lavender tracking-wide">🌸 Well-Being Dashboard</div>
      <div className="flex gap-6">
        <Link to="/" className={`rounded-xl px-4 py-2 transition-all duration-200 font-semibold ${location.pathname === '/' ? 'bg-blush dark:bg-dm-blush text-dm-offblack' : 'hover:bg-cream dark:hover:bg-dm-cream text-mint dark:text-dm-mint'}`}>Dashboard</Link>
        <Link to="/mood" className={`rounded-xl px-4 py-2 transition-all duration-200 font-semibold ${location.pathname === '/mood' ? 'bg-blush dark:bg-dm-blush text-dm-offblack' : 'hover:bg-cream dark:hover:bg-dm-cream text-mint dark:text-dm-mint'}`}>Mood</Link>
        <Link to="/meetings" className={`rounded-xl px-4 py-2 transition-all duration-200 font-semibold ${location.pathname === '/meetings' ? 'bg-blush dark:bg-dm-blush text-dm-offblack' : 'hover:bg-cream dark:hover:bg-dm-cream text-mint dark:text-dm-mint'}`}>Meetings</Link>
        <Link to="/productivity" className={`rounded-xl px-4 py-2 transition-all duration-200 font-semibold ${location.pathname === '/productivity' ? 'bg-blush dark:bg-dm-blush text-dm-offblack' : 'hover:bg-cream dark:hover:bg-dm-cream text-mint dark:text-dm-mint'}`}>Productivity</Link>
        <Link to="/reports" className={`rounded-xl px-4 py-2 transition-all duration-200 font-semibold ${location.pathname === '/reports' ? 'bg-blush dark:bg-dm-blush text-dm-offblack' : 'hover:bg-cream dark:hover:bg-dm-cream text-mint dark:text-dm-mint'}`}>Reports</Link>
        <button onClick={handleLogout} className="ml-4 text-blush dark:text-dm-blush font-semibold rounded-xl px-4 py-2 hover:bg-cream dark:hover:bg-dm-cream transition-all duration-200">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
