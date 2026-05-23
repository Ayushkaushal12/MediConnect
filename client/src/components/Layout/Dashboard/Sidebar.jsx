import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  Users,
  Stethoscope,
  Activity
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
     logout();
     navigate('/');
  };

  const patientLinks = [
    { name: 'Overview', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus },
    { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    // { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const doctorLinks = [
    { name: 'Overview', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Patients', path: '/doctor/patients', icon: Users },
    // { name: 'Settings', path: '/doctor/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    // { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  let links = [];
  if (user?.role === 'patient') links = patientLinks;
  else if (user?.role === 'doctor') links = doctorLinks;
  else if (user?.role === 'admin') links = adminLinks;

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col">
       <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              MediConnect
            </span>
        </div>
        
        <div className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
        </div>
        <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
