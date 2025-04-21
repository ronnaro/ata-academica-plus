
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateTimeSection } from './meetings/DateTimeSection';
import { ParticipantsSection } from './meetings/ParticipantsSection';
import { AttachmentsSection } from './meetings/AttachmentsSection';
import { useMeetingForm } from '@/hooks/useMeetingForm';
import { NewMeetingFormProps } from '@/types/meeting';
import { useProfessors } from '@/hooks/useProfessors';

type MeetingType = 'ordinaria' | 'extraordinaria' | 'colegiado' | 'comissao' | 'outros';

const meetingTypes = [
  { value: 'ordinaria', label: 'Ordinária' },
  { value: 'extraordinaria', label: 'Extraordinária' },
  { value: 'colegiado', label: 'Colegiado' },
  { value: 'comissao', label: 'Comissão' },
  { value: 'outros', label: 'Outros' },
];

const NewMeetingForm: React.FC<NewMeetingFormProps> = ({ onComplete }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType>('ordinaria');
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [agenda, setAgenda] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [semesters, setSemesters] = useState<{ id: string; name: string; }[]>([]);
  const { professors, isLoading: professorsLoading } = useProfessors();

  const { handleSubmit, isSubmitting } = useMeetingForm(onComplete);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({
      title,
      date,
      startTime,
      endTime,
      location,
      meetingType,
      selectedProfessors,
      agenda,
      semesterId,
      attachments
    });
  };

  const toggleProfessor = (id: number) => {
    setSelectedProfessors(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  if (professorsLoading) {
    return <div className="py-4">Loading professors...</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
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

      <DateTimeSection
        date={date}
        startTime={startTime}
        endTime={endTime}
        onDateChange={setDate}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />

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
        <Select value={meetingType} onValueChange={(value: MeetingType) => setMeetingType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de reunião" />
          </SelectTrigger>
          <SelectContent>
            {meetingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value as MeetingType}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ParticipantsSection
        professors={professors}
        selectedProfessors={selectedProfessors}
        onToggleProfessor={toggleProfessor}
      />

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

      <AttachmentsSection
        attachments={attachments}
        onAttachmentsChange={setAttachments}
      />

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
