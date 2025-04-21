
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

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

  const generatePDF = (professor: typeof professors[0]) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const hoursAttended = professor.meetingsAttended * 2;
      
      // Add the Institute logo and headers
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO PARÁ', 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text('CAMPUS BELÉM', 105, 30, { align: 'center' });
      doc.text('DECLARAÇÃO DE PARTICIPAÇÃO', 105, 45, { align: 'center' });
      
      // Horizontal line
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);
      
      // Certificate text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const text = [
        `Declaro para os devidos fins que ${professor.name}, SIAPE ${professor.siape}, docente do `,
        `departamento de ${professor.department}, participou de ${professor.meetingsAttended} reuniões do colegiado `,
        `no período ${selectedPeriod}, totalizando ${hoursAttended} horas de atividades.`
      ];
      
      doc.text(text, 20, 70);
      
      // Signature
      doc.text('Belém, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }), 105, 130, { align: 'center' });
      doc.line(70, 160, 140, 160);
      doc.text('Coordenador do Curso', 105, 170, { align: 'center' });
      
      // Footer
      doc.setFontSize(8);
      doc.text('Documento gerado pelo sistema Acta Academica', 105, 280, { align: 'center' });
      
      // Save the PDF with the professor's name
      const filename = `declaracao_${professor.name.replace(/\s+/g, '_').toLowerCase()}_${selectedPeriod}.pdf`;
      
      // Log the certificate generation
      logCertificateGeneration(professor.id, selectedPeriod, hoursAttended);
      
      // Download the PDF
      doc.save(filename);
      
      return filename;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
      return null;
    }
  };

  const logCertificateGeneration = async (professorId: number, period: string, hours: number) => {
    try {
      // In a real app with Supabase, this would save to the certificates table
      console.log(`Certificate generated for professor ${professorId} for period ${period} with ${hours} hours`);
      
      // Example of how this would work with a real Supabase database
      if (user) {
        // This is just a log for demonstration
        console.log('Certificate would be saved to database with user ID:', user.id);
        // In a real implementation, this would be an insert to the certificates table
      }
    } catch (error) {
      console.error('Erro ao registrar geração de certificado:', error);
    }
  };

  const handleDownloadCertificate = (professorId: number) => {
    const professor = professors.find(p => p.id === professorId);
    if (!professor) {
      toast.error('Professor não encontrado');
      return;
    }
    
    const filename = generatePDF(professor);
    if (filename) {
      toast.success(`Declaração de ${professor.name} baixada com sucesso`);
    }
  };

  const handleGenerateCertificates = () => {
    if (selectedProfessors.length === 0) {
      toast.error('Selecione pelo menos um professor');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate PDFs for all selected professors
      let successCount = 0;
      
      selectedProfessors.forEach(professorId => {
        const professor = professors.find(p => p.id === professorId);
        if (professor) {
          const filename = generatePDF(professor);
          if (filename) {
            successCount++;
          }
        }
      });
      
      if (successCount > 0) {
        toast.success(`${successCount} declarações geradas com sucesso`);
      }
    } catch (error) {
      console.error('Erro ao gerar declarações em lote:', error);
      toast.error('Ocorreu um erro ao gerar as declarações');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadBatch = () => {
    if (selectedProfessors.length === 0) {
      toast.error('Selecione pelo menos um professor');
      return;
    }

    toast.info('Iniciando download em lote...');
    
    setTimeout(() => {
      handleGenerateCertificates();
    }, 500);
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
                  onClick={handleDownloadBatch}
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
