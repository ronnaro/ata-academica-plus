
export interface Professor {
  id: number;
  name: string;
}

export interface MeetingFormData {
  title: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  location: string;
  meetingType: string;
  selectedProfessors: number[];
  agenda: string;
  semesterId: string;
  attachments: FileList | null;
}

export interface NewMeetingFormProps {
  onComplete: () => void;
}
