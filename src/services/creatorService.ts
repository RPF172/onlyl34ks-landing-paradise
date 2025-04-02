
import { supabase } from '@/integrations/supabase/client';
import { Creator, CreateCreatorInput, UpdateCreatorInput } from '@/types/creator';

export const fetchCreators = async (): Promise<Creator[]> => {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creators:', error);
    throw new Error(error.message);
  }

  return data as Creator[];
};

export const fetchCreator = async (id: string): Promise<Creator> => {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching creator with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Creator;
};

export const createCreator = async (creator: CreateCreatorInput): Promise<Creator> => {
  const { data, error } = await supabase
    .from('creators')
    .insert([creator])
    .select()
    .single();

  if (error) {
    console.error('Error creating creator:', error);
    throw new Error(error.message);
  }

  return data as Creator;
};

export const updateCreator = async ({ id, ...creator }: UpdateCreatorInput): Promise<Creator> => {
  const { data, error } = await supabase
    .from('creators')
    .update(creator)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating creator with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Creator;
};

export const deleteCreator = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('creators')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting creator with id ${id}:`, error);
    throw new Error(error.message);
  }
};
