
import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children,
  userName = 'Usuário',
  userRole = 'Coordenador'
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would call the Supabase logout function
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        userName={userName} 
        userRole={userRole} 
        onLogout={handleLogout} 
      />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
