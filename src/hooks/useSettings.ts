
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { InstitutionSettings, CertificateSettings, MeetingSettings } from '@/types/settings';

// Re-export as type to comply with isolatedModules
export type { InstitutionSettings, CertificateSettings, MeetingSettings };

export const useSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const saveInstitutionSettings = async (settings: InstitutionSettings) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar configurações');
      return false;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          user_id: user.id,
          settings_type: 'institution',
          settings_data: {
            name: settings.name,
            abbreviation: settings.abbreviation,
            campus: settings.campus,
            department: settings.department,
            logo_path: null // Will be updated if logo is uploaded
          }
        });

      if (error) throw error;

      // Handle logo upload if present
      if (settings.logo) {
        const fileExt = settings.logo.name.split('.').pop();
        const fileName = `institution_logo_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('settings_files')
          .upload(filePath, settings.logo);

        if (uploadError) throw uploadError;

        // Update logo path in settings
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            settings_data: {
              name: settings.name,
              abbreviation: settings.abbreviation,
              campus: settings.campus,
              department: settings.department,
              logo_path: filePath
            }
          })
          .match({ user_id: user.id, settings_type: 'institution' });

        if (updateError) throw updateError;
      }

      toast.success('Configurações da instituição salvas com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(`Erro ao salvar configurações: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveCertificateSettings = async (settings: CertificateSettings) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar configurações');
      return false;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          user_id: user.id,
          settings_type: 'certificate',
          settings_data: settings
        });

      if (error) throw error;

      toast.success('Configurações de declarações salvas com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(`Erro ao salvar configurações: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveMeetingSettings = async (settings: MeetingSettings) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar configurações');
      return false;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          user_id: user.id,
          settings_type: 'meeting',
          settings_data: settings
        });

      if (error) throw error;

      toast.success('Configurações de reuniões salvas com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(`Erro ao salvar configurações: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSettings = async <T,>(settingsType: string): Promise<T | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('settings_data')
        .eq('user_id', user.id)
        .eq('settings_type', settingsType)
        .maybeSingle();

      if (error) throw error;

      return data?.settings_data as T || null;
    } catch (error: any) {
      console.error(`Erro ao carregar configurações: ${error.message}`);
      return null;
    }
  };

  return {
    isSubmitting,
    saveInstitutionSettings,
    saveCertificateSettings,
    saveMeetingSettings,
    loadSettings
  };
};
