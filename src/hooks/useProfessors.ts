
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professor } from '@/types/meeting';
import { toast } from 'sonner';

export const useProfessors = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const { data, error } = await supabase
          .from('professors')
          .select('id, full_name as name');

        if (error) {
          throw error;
        }

        setProfessors(data || []);
      } catch (error: any) {
        toast.error(`Error fetching professors: ${error.message}`);
        setProfessors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  return { professors, isLoading };
};
