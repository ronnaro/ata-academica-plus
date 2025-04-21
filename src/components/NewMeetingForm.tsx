import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NewMeetingFormProps {
  onComplete: () => void;
}

interface Semester {
  id: string;
  name: string;
}

const NewMeetingForm: React.FC<NewMeetingFormProps> = ({ onComplete }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [agenda, setAgenda] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      const { data, error } = await supabase
        .from('academic_semesters')
        .select('id, name')
        .order('start_date', { ascending: false });

      if (error) {
        toast.error(`Erro ao carregar semestres: ${error.message}`);
        return;
      }

      setSemesters(data || []);
    };

    fetchSemesters();
  }, []);

  const meetingTypes = [
    { value: 'ordinaria', label: 'Ordinária' },
    { value: 'extraordinaria', label: 'Extraordinária' },
    { value: 'colegiado', label: 'Colegiado' },
    { value: 'comissao', label: 'Comissão' },
    { value: 'outros', label: 'Outros' },
  ];

  const toggleProfessor = (id: number) => {
    setSelectedProfessors(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !date || !location || !meetingType || !semesterId || selectedProfessors.length === 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          title,
          meeting_date: date ? format(date, 'yyyy-MM-dd') : '',
          start_time: startTime,
          end_time: endTime,
          location,
          meeting_type: meetingType,
          semester_id: semesterId,
          agenda,
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      if (attachments && attachments.length > 0) {
        for (const file of Array.from(attachments)) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `meeting_files/${meetingData.id}/${fileName}`;

          const { error: uploadError } = await supabase
            .storage
            .from('meeting_files')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { error: attachmentError } = await supabase
            .from('meeting_attachments')
            .insert({
              meeting_id: meetingData.id,
              file_path: filePath,
              filename: file.name,
            });

          if (attachmentError) throw attachmentError;
        }
      }

      const participantPromises = selectedProfessors.map(professorId =>
        supabase
          .from('meeting_participants')
          .insert({
            meeting_id: meetingData.id,
            professor_id: professorId,
          })
      );

      await Promise.all(participantPromises);

      toast.success('Reunião agendada com sucesso!');
      onComplete();
    } catch (error: any) {
      toast.error(`Erro ao agendar reunião: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Título da Reunião *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Reunião Ordinária do Colegiado"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Data *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Horário *</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Local *
        </label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ex: Sala de Reuniões do Campus"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="semester" className="text-sm font-medium">
          Semestre Letivo *
        </label>
        <Select value={semesterId} onValueChange={setSemesterId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o semestre" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="meeting-type" className="text-sm font-medium">
          Tipo de Reunião *
        </label>
        <Select value={meetingType} onValueChange={setMeetingType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de reunião" />
          </SelectTrigger>
          <SelectContent>
            {meetingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Participantes *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-52 overflow-y-auto">
          {professors.map((professor) => (
            <div key={professor.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`professor-${professor.id}`}
                checked={selectedProfessors.includes(professor.id)}
                onChange={() => toggleProfessor(professor.id)}
                className="rounded border-gray-300"
              />
              <label htmlFor={`professor-${professor.id}`} className="text-sm">
                {professor.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="agenda" className="text-sm font-medium">
          Pauta
        </label>
        <Textarea
          id="agenda"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          placeholder="Descreva os tópicos da pauta da reunião"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6">
          <input
            type="file"
            id="attachments"
            className="hidden"
            multiple
            onChange={(e) => setAttachments(e.target.files)}
          />
          <label htmlFor="attachments" className="cursor-pointer">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-4 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <Button type="button" variant="outline" className="mt-2">
                Selecionar Arquivos
              </Button>
            </div>
          </label>
          {attachments && attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {Array.from(attachments).map((file, index) => (
                <div key={index} className="text-sm text-gray-500">
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-academic-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Agendar Reunião'}
        </Button>
      </div>
    </form>
  );
};

export default NewMeetingForm;
