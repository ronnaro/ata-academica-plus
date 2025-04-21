
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MeetingFormData } from '@/types/meeting';
import { format } from 'date-fns';

export const useMeetingForm = (onComplete: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (formData: MeetingFormData) => {
    setIsSubmitting(true);

    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          title: formData.title,
          meeting_date: formData.date ? format(formData.date, 'yyyy-MM-dd') : '',
          start_time: formData.startTime,
          end_time: formData.endTime,
          location: formData.location,
          meeting_type: formData.meetingType,
          semester_id: formData.semesterId,
          agenda: formData.agenda,
          created_by: user?.id || ''
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      if (formData.attachments && formData.attachments.length > 0) {
        for (const file of Array.from(formData.attachments)) {
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
              uploaded_by: user?.id || ''
            });

          if (attachmentError) throw attachmentError;
        }
      }

      for (const professorId of formData.selectedProfessors) {
        const { error: participantError } = await supabase
          .from('meeting_participants')
          .insert({
            meeting_id: meetingData.id,
            professor_id: professorId.toString(),
            attendance_status: false,
            hours_computed: 2
          });

        if (participantError) throw participantError;
      }

      toast.success('Reunião agendada com sucesso!');
      onComplete();
    } catch (error: any) {
      toast.error(`Erro ao agendar reunião: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
