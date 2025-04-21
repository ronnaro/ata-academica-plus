
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isCoordinator, signOut } = useAuth();
  
  const userName = user?.user_metadata?.full_name || 'Usuário';
  const userRole = isCoordinator ? 'Coordenador' : 'Docente';

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        userName={userName} 
        userRole={userRole} 
        onLogout={signOut} 
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
