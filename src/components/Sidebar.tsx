
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar,
  FileText, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import logo from '../assets/ifpa-logo.png';

interface SidebarProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userName = 'Usuário', 
  userRole = 'Coordenador',
  onLogout = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: <Calendar className="h-5 w-5" />, label: 'Reuniões' },
    { to: '/professors', icon: <Users className="h-5 w-5" />, label: 'Professores' },
    { to: '/certificates', icon: <FileText className="h-5 w-5" />, label: 'Declarações' },
    { to: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Configurações' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed z-30 top-4 left-4 p-2 rounded-md bg-academic-primary text-white md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-20 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col justify-between py-4">
          {/* App logo and title */}
          <div className="px-4 py-2 flex flex-col items-center border-b border-gray-200 dark:border-gray-700">
            <img src={logo} alt="IFPA Logo" className="h-16 mb-2" />
            <h1 className="text-xl font-bold text-academic-primary dark:text-academic-secondary">Acta Academica</h1>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center px-4 py-2 mx-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                      location.pathname === item.to ? "bg-academic-light dark:bg-gray-800 text-academic-primary dark:text-academic-secondary" : ""
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info and theme toggle */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userRole}</p>
              </div>
              <ThemeToggle />
            </div>
            <button
              onClick={onLogout}
              className="mt-2 w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
