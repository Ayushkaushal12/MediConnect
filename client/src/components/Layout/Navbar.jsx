import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../UI/Button';
import { Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDashboardClick = () => {
    if (user) {
      if (user.role === 'patient') navigate('/patient/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Simple scroll function if on home page, otherwise navigate then scroll logic handled by browser hash
  // Since we use Link to="/#hash", react-router might not scroll automatically without extra config.
  // Standard anchor tags are safer for cross-page hash navigation in simple apps, 
  // but let's stick to Link or a-tags. a-tags cause full reload which is bad for SPA.
  // Actually, React Router Hash Link is best, but I don't want to install new deps.
  // I'll use a simple approach: if path is /, scroll. If not, navigate to /#hash.
  // But standard <a href="/#hash"> works fine usually for simple landing pages. Let's use simple a tags for landing links.

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              MediConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#home" className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Home</a>
            <a href="/#features" className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Features</a>
            <a href="/#about" className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">About</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
               <>
                 <span className="text-sm text-gray-400 hidden sm:block">Hi, {user.name}</span>
                 <Button onClick={handleDashboardClick} variant="primary" size="sm">
                   Dashboard
                 </Button>
                 <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-white/5">
                   <LogOut className="w-5 h-5" />
                 </Button>
               </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
