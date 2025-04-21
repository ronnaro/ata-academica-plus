
import { jsPDF } from 'jspdf';
import { Professor } from '@/types/certificate';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const generatePDF = (professor: Professor, selectedPeriod: string) => {
  try {
    const doc = new jsPDF();
    const hoursAttended = professor.meetingsAttended * 2;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO PARÁ', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('CAMPUS BELÉM', 105, 30, { align: 'center' });
    doc.text('DECLARAÇÃO DE PARTICIPAÇÃO', 105, 45, { align: 'center' });
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const text = [
      `Declaro para os devidos fins que ${professor.name}, SIAPE ${professor.siape}, docente do `,
      `departamento de ${professor.department}, participou de ${professor.meetingsAttended} reuniões do colegiado `,
      `no período ${selectedPeriod}, totalizando ${hoursAttended} horas de atividades.`
    ];
    
    doc.text(text, 20, 70);
    
    doc.text('Belém, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }), 105, 130, { align: 'center' });
    doc.line(70, 160, 140, 160);
    doc.text('Coordenador do Curso', 105, 170, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('Documento gerado pelo sistema Acta Academica', 105, 280, { align: 'center' });
    
    const filename = `declaracao_${professor.name.replace(/\s+/g, '_').toLowerCase()}_${selectedPeriod}.pdf`;
    
    doc.save(filename);
    
    return filename;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    toast.error('Erro ao gerar PDF');
    return null;
  }
};

export const logCertificateGeneration = async (professorId: number, period: string, hours: number, userId?: string) => {
  try {
    if (userId) {
      console.log('Certificate would be saved to database with user ID:', userId);
    }
  } catch (error) {
    console.error('Erro ao registrar geração de certificado:', error);
  }
};
