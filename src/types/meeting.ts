
export interface Professor {
  id: number;
  name: string;
}

export type MeetingType = 'ordinaria' | 'extraordinaria' | 'colegiado' | 'comissao' | 'outros';

export interface MeetingFormData {
  title: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  location: string;
  meetingType: MeetingType;
  selectedProfessors: number[];
  agenda: string;
  semesterId: string;
  attachments: FileList | null;
}

export interface NewMeetingFormProps {
  onComplete: () => void;
}
