
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MeetingFormData } from '@/types/meeting';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export const useMeetingForm = (onComplete: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (formData: MeetingFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a meeting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert meeting data
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          title: formData.title,
          meeting_date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
          start_time: formData.startTime,
          end_time: formData.endTime,
          location: formData.location,
          meeting_type: formData.meetingType,
          semester_id: formData.semesterId,
          agenda: formData.agenda,
          created_by: user.id
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      // Handle file uploads if there are attachments
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

          // Create attachment record
          const { error: attachmentError } = await supabase
            .from('meeting_attachments')
            .insert({
              meeting_id: meetingData.id,
              file_path: filePath,
              filename: file.name,
              uploaded_by: user.id
            });

          if (attachmentError) throw attachmentError;
        }
      }

      // Add participants
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

      toast.success('Meeting scheduled successfully!');
      onComplete();
    } catch (error: any) {
      toast.error(`Error scheduling meeting: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
