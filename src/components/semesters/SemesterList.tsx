
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Semester {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export const SemesterList = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSemesters = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_semesters')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setSemesters(data || []);
    } catch (error: any) {
      toast.error(`Erro ao carregar semestres: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Carregando semestres...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Semestre</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead>Data de Término</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {semesters.map((semester) => (
            <TableRow key={semester.id}>
              <TableCell className="font-medium">{semester.name}</TableCell>
              <TableCell>{format(new Date(semester.start_date), "PPP", { locale: ptBR })}</TableCell>
              <TableCell>{format(new Date(semester.end_date), "PPP", { locale: ptBR })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
