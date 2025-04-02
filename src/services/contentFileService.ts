
import { supabase } from '@/integrations/supabase/client';
import { ContentFile, CreateContentFileInput } from '@/types/contentFile';

const STORAGE_BUCKET = 'content-files';

export const uploadFile = async (file: File, creatorId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `creator_${creatorId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }

  return filePath;
};

export const getFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);
  
  return data?.publicUrl || '';
};

export const createContentFileRecord = async (input: CreateContentFileInput): Promise<ContentFile> => {
  const { data, error } = await supabase
    .from('content_files')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating content file record:', error);
    throw new Error(error.message);
  }

  return data as ContentFile;
};

export const fetchContentFilesByCreator = async (creatorId: string): Promise<ContentFile[]> => {
  const { data, error } = await supabase
    .from('content_files')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching content files for creator ${creatorId}:`, error);
    throw new Error(error.message);
  }

  return data as ContentFile[];
};

export const deleteContentFile = async (id: string, filePath: string): Promise<void> => {
  // Delete the file from storage first
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    throw new Error(storageError.message);
  }

  // Then delete the database record
  const { error: dbError } = await supabase
    .from('content_files')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error(`Error deleting content file record with id ${id}:`, dbError);
    throw new Error(dbError.message);
  }
};
