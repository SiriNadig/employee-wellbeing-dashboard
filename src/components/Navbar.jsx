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
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
      <div className="font-bold text-xl">Well-Being Dashboard</div>
      <div className="flex gap-4">
        <Link to="/" className={location.pathname === '/' ? 'font-semibold' : ''}>Dashboard</Link>
        <Link to="/mood" className={location.pathname === '/mood' ? 'font-semibold' : ''}>Mood</Link>
        <Link to="/meetings" className={location.pathname === '/meetings' ? 'font-semibold' : ''}>Meetings</Link>
        <Link to="/productivity" className={location.pathname === '/productivity' ? 'font-semibold' : ''}>Productivity</Link>
        <Link to="/reports" className={location.pathname === '/reports' ? 'font-semibold' : ''}>Reports</Link>
        <button onClick={handleLogout} className="ml-4 text-red-500">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
