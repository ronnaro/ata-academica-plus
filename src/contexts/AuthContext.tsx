
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isCoordinator: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_OUT') {
        setIsCoordinator(false);
      } else if (event === 'SIGNED_IN' && currentSession?.user) {
        // Use setTimeout to prevent potential auth deadlocks
        setTimeout(() => {
          checkIfCoordinator(currentSession.user.id);
        }, 0);
      }
    });

    // Then check for an existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await checkIfCoordinator(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIfCoordinator = async (userId: string) => {
    try {
      // Handle specific case for Ronnaro
      if (userId === '00000000-0000-0000-0000-000000000000' || 
          user?.email === 'ronnaro.jardim@ifpa.edu.br') {
        setIsCoordinator(true);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setIsCoordinator(data?.role === 'coordenador');
    } catch (error) {
      console.error('Erro ao verificar função do usuário:', error);
      // Fallback for Ronnaro if there was an error
      if (user?.email === 'ronnaro.jardim@ifpa.edu.br') {
        setIsCoordinator(true);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        // Special case for Ronnaro
        if (email === 'ronnaro.jardim@ifpa.edu.br') {
          setIsCoordinator(true);
        } else {
          await checkIfCoordinator(data.user.id);
        }
        toast.success('Login realizado com sucesso');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(`Erro ao fazer login: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role = 'docente') => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Cadastro realizado com sucesso. Verifique seu email para confirmar.');
    } catch (error: any) {
      toast.error(`Erro ao fazer cadastro: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success('Você saiu do sistema');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Erro ao sair: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        isLoading, 
        isCoordinator,
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
