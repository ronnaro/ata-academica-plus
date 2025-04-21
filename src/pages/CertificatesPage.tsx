
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for professors and periods
const professors = [
  { id: 1, name: 'Ana Silva', siape: '1234567', department: 'Informática', meetingsAttended: 12 },
  { id: 2, name: 'Carlos Oliveira', siape: '2345678', department: 'Matemática', meetingsAttended: 8 },
  { id: 3, name: 'Mariana Santos', siape: '3456789', department: 'Biologia', meetingsAttended: 15 },
  { id: 4, name: 'Ricardo Lima', siape: '4567890', department: 'Física', meetingsAttended: 10 },
  { id: 5, name: 'Juliana Costa', siape: '5678901', department: 'Língua Portuguesa', meetingsAttended: 7 },
];

const periods = [
  { value: '2024.1', label: '2024.1 (Jan-Jun)' },
  { value: '2023.2', label: '2023.2 (Jul-Dez)' },
  { value: '2023.1', label: '2023.1 (Jan-Jun)' },
  { value: '2022.2', label: '2022.2 (Jul-Dez)' },
];

const CertificatesPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024.1');
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleAllProfessors = () => {
    if (selectedProfessors.length === professors.length) {
      setSelectedProfessors([]);
    } else {
      setSelectedProfessors(professors.map(p => p.id));
    }
  };

  const toggleProfessor = (id: number) => {
    setSelectedProfessors(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  const handleGenerateCertificates = () => {
    if (selectedProfessors.length === 0) {
      toast.error('Selecione pelo menos um professor');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Declarações geradas com sucesso para ${selectedProfessors.length} professor(es)`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownloadCertificate = (id: number) => {
    // Simulate download
    toast.success('Iniciando download da declaração');
    // In a real app, this would trigger a download from Supabase Storage
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-academic-primary dark:text-academic-secondary">Declarações</h1>
        </div>

        <Card className="card-academic">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="w-full sm:w-64">
                  <label htmlFor="period-select" className="text-sm font-medium block mb-2">
                    Período
                  </label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleGenerateCertificates}
                  className="bg-academic-primary w-full sm:w-auto"
                  disabled={selectedProfessors.length === 0 || isGenerating}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Gerando...' : 'Gerar Declarações'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={selectedProfessors.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar em Lote
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedProfessors.length === professors.length}
                          onCheckedChange={toggleAllProfessors}
                          aria-label="Selecionar todos"
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">SIAPE</TableHead>
                      <TableHead className="hidden md:table-cell">Curso/Setor</TableHead>
                      <TableHead className="text-center">Reuniões</TableHead>
                      <TableHead className="text-center">Carga Horária</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professors.map((professor) => (
                      <TableRow key={professor.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProfessors.includes(professor.id)}
                            onCheckedChange={() => toggleProfessor(professor.id)}
                            aria-label={`Selecionar ${professor.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{professor.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{professor.siape}</TableCell>
                        <TableCell className="hidden md:table-cell">{professor.department}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Users className="h-4 w-4 mr-1" />
                            {professor.meetingsAttended}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {professor.meetingsAttended * 2}h
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCertificate(professor.id)}
                            className="text-academic-secondary border-academic-secondary"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CertificatesPage;
