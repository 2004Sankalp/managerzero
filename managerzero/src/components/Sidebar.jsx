import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, MessageSquare, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { role, currentUser, theme, toggleTheme, setRole, setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  const managerNavItems = [
    { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
    { name: 'Standups', path: '/manager/standup', icon: Users },
    { name: 'Meetings', path: '/manager/meetings', icon: FileText },
    { name: 'Feedback', path: '/manager/feedback', icon: MessageSquare },
  ];

  const employeeNavItems = [
    { name: 'My Dashboard', path: '/employee', icon: LayoutDashboard },
    { name: 'My Meetings', path: '/employee/meetings', icon: FileText },
  ];

  const navItems = role === 'manager' ? managerNavItems : employeeNavItems;

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-border bg-gray-50 dark:bg-card flex flex-col h-full flex-shrink-0 transition-colors">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-border">
        <div className="w-3 h-3 rounded-full bg-accent mr-3 cursor-pointer"></div>
        <span className="font-bold text-lg tracking-wide text-black dark:text-white cursor-pointer" onClick={() => window.location.href = '/'}>ManagerZero</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.name.includes('Dashboard')}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative
              ${isActive 
                ? 'bg-accent/10 border-l-[3px] border-accent text-accent pl-[9px]' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-black dark:hover:text-white border-l-[3px] border-transparent'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Utilities */}
      <div className="px-3 pb-4 space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all group"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log out
        </button>
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-gray-200 dark:border-border bg-gray-50 dark:bg-card flex items-center">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
          {role === 'manager' ? 'MG' : currentUser?.substring(0, 2).toUpperCase() || 'EM'}
        </div>
        <div className="ml-3 overflow-hidden text-black dark:text-white">
          <p className="text-sm font-medium truncate">{role === 'manager' ? 'Manager.eth' : currentUser}</p>
          <p className="text-xs text-gray-500 truncate capitalize">{role}</p>
        </div>
      </div>
    </aside>
  );
}
