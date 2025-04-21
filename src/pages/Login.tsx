import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '../assets/ifpa-logo.png';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // This would call Supabase Auth in a real app
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });

      // if (error) throw error;

      // Simulate login success for now
      setTimeout(() => {
        toast.success('Login realizado com sucesso');
        navigate('/dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 items-center text-center">
          <img src={logo} alt="IFPA Logo" className="h-20 mb-2" />
          <CardTitle className="text-2xl font-bold">Ata Academica</CardTitle>
          <CardDescription>
            Sistema de Gerenciamento de Atas e Declarações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Institucional
              </label>
              <Input id="email" type="email" placeholder="seu.email@ifpa.edu.br" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-academic-primary hover:bg-academic-primary/90" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acesso exclusivo para coordenações e docentes do IFPA.
          </p>
        </CardFooter>
      </Card>
    </div>;
};
export default Login;