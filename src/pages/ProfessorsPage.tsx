
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for professors
const initialProfessors = [
  { id: 1, name: 'Ana Silva', siape: '1234567', email: 'ana.silva@ifpa.edu.br', department: 'Informática', meetingsAttended: 12 },
  { id: 2, name: 'Carlos Oliveira', siape: '2345678', email: 'carlos.oliveira@ifpa.edu.br', department: 'Matemática', meetingsAttended: 8 },
  { id: 3, name: 'Mariana Santos', siape: '3456789', email: 'mariana.santos@ifpa.edu.br', department: 'Biologia', meetingsAttended: 15 },
  { id: 4, name: 'Ricardo Lima', siape: '4567890', email: 'ricardo.lima@ifpa.edu.br', department: 'Física', meetingsAttended: 10 },
  { id: 5, name: 'Juliana Costa', siape: '5678901', email: 'juliana.costa@ifpa.edu.br', department: 'Língua Portuguesa', meetingsAttended: 7 },
];

interface Professor {
  id: number;
  name: string;
  siape: string;
  email: string;
  department: string;
  meetingsAttended: number;
}

const ProfessorsPage = () => {
  const [professors, setProfessors] = useState<Professor[]>(initialProfessors);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New professor form state
  const [newProfessor, setNewProfessor] = useState({
    name: '',
    siape: '',
    email: '',
    department: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter professors based on search term
  const filteredProfessors = professors.filter(
    professor => 
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.siape.includes(searchTerm) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfessor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would call Supabase to save the professor in a real app
      // const { data, error } = await supabase.from('professors').insert({
      //   name: newProfessor.name,
      //   siape: newProfessor.siape,
      //   email: newProfessor.email,
      //   department: newProfessor.department,
      // });
      
      // if (error) throw error;

      // Simulate API call
      setTimeout(() => {
        // Add to local state
        const newId = professors.length > 0 ? Math.max(...professors.map(p => p.id)) + 1 : 1;
        setProfessors([
          ...professors,
          {
            id: newId,
            ...newProfessor,
            meetingsAttended: 0,
          }
        ]);

        toast.success('Professor cadastrado com sucesso!');
        setIsSubmitting(false);
        setIsDialogOpen(false);
        setNewProfessor({
          name: '',
          siape: '',
          email: '',
          department: '',
        });
      }, 1000);
    } catch (error) {
      toast.error('Erro ao cadastrar professor. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleViewCertificate = (id: number) => {
    toast.info('Funcionalidade em desenvolvimento');
    // Navigate to certificate page for this professor
    // navigate(`/certificates/professor/${id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-academic-primary dark:text-academic-secondary">Professores</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-academic-primary w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Professor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Professor</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para cadastrar um novo professor.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProfessor} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nome Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={newProfessor.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="siape" className="text-sm font-medium">
                      Matrícula SIAPE *
                    </label>
                    <Input
                      id="siape"
                      name="siape"
                      value={newProfessor.siape}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      E-mail Institucional *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newProfessor.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium">
                      Curso/Setor *
                    </label>
                    <Input
                      id="department"
                      name="department"
                      value={newProfessor.department}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-academic-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Salvando...' : 'Cadastrar Professor'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SIAPE</TableHead>
                <TableHead className="hidden md:table-cell">E-mail</TableHead>
                <TableHead className="hidden md:table-cell">Curso/Setor</TableHead>
                <TableHead className="text-center">Reuniões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessors.length > 0 ? (
                filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell className="font-medium">{professor.name}</TableCell>
                    <TableCell>{professor.siape}</TableCell>
                    <TableCell className="hidden md:table-cell">{professor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{professor.department}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Users className="h-4 w-4 mr-1" />
                        {professor.meetingsAttended}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCertificate(professor.id)}
                        className="text-academic-secondary border-academic-secondary"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Declaração
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum professor encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfessorsPage;
