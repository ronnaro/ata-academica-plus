
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Users, Clock } from 'lucide-react';
import { Professor } from '@/types/certificate';

interface ProfessorsTableProps {
  professors: Professor[];
  selectedProfessors: number[];
  onToggleProfessor: (id: number) => void;
  onToggleAll: () => void;
  onDownloadCertificate: (professorId: number) => void;
}

export const ProfessorsTable = ({
  professors,
  selectedProfessors,
  onToggleProfessor,
  onToggleAll,
  onDownloadCertificate,
}: ProfessorsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProfessors.length === professors.length}
                onCheckedChange={onToggleAll}
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
                  onCheckedChange={() => onToggleProfessor(professor.id)}
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
                  onClick={() => onDownloadCertificate(professor.id)}
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
  );
};
