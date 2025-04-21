
export type InstitutionSettings = {
  name: string;
  abbreviation: string;
  campus: string;
  department: string;
  logo: File | null;
  logo_path?: string;
};

export type CertificateSettings = {
  headerText: string;
  footerText: string;
  signature: string;
  workloadPerMeeting: number;
  showInstitutionLogo: boolean;
};

export type MeetingSettings = {
  defaultType: string;
  defaultDuration: number;
};

export type Settings = {
  id?: string;
  user_id: string;
  settings_type: string;
  settings_data: InstitutionSettings | CertificateSettings | MeetingSettings;
  created_at?: string;
  updated_at?: string;
};
