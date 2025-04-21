
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { professors, periods } from '@/constants/certificateData';
import { generatePDF, logCertificateGeneration } from '@/utils/certificateUtils';
import { PeriodSelector } from '@/components/certificates/PeriodSelector';
import { ProfessorsTable } from '@/components/certificates/ProfessorsTable';

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

  const handleDownloadCertificate = (professorId: number) => {
    const professor = professors.find(p => p.id === professorId);
    if (!professor) {
      toast.error('Professor não encontrado');
      return;
    }
    
    const filename = generatePDF(professor, selectedPeriod);
    if (filename) {
      logCertificateGeneration(professor.id, selectedPeriod, professor.meetingsAttended * 2, user?.id);
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
      let successCount = 0;
      
      selectedProfessors.forEach(professorId => {
        const professor = professors.find(p => p.id === professorId);
        if (professor) {
          const filename = generatePDF(professor, selectedPeriod);
          if (filename) {
            logCertificateGeneration(professor.id, selectedPeriod, professor.meetingsAttended * 2, user?.id);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-academic-primary dark:text-academic-secondary">
            Declarações
          </h1>
        </div>

        <Card className="card-academic">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <PeriodSelector
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  periods={periods}
                />
                
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
                  onClick={handleGenerateCertificates}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar em Lote
                </Button>
              </div>

              <ProfessorsTable
                professors={professors}
                selectedProfessors={selectedProfessors}
                onToggleProfessor={toggleProfessor}
                onToggleAll={toggleAllProfessors}
                onDownloadCertificate={handleDownloadCertificate}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CertificatesPage;
