
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
          .select('id, full_name');

        if (error) {
          throw error;
        }

        // Transform the data to match the Professor type
        const transformedData = data ? data.map(prof => ({
          id: Number(prof.id),
          name: prof.full_name
        })) : [];

        setProfessors(transformedData);
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
