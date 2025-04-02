
import { supabase } from '@/integrations/supabase/client';
import { ContentFile, CreateContentFileInput } from '@/types/contentFile';

export const fetchContentFiles = async (creatorId: string): Promise<ContentFile[]> => {
  const { data, error } = await supabase
    .from('content_files')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content files:', error);
    throw new Error(error.message);
  }

  return data as ContentFile[];
};

// Alias for fetchContentFiles to match the import in ContentFilesList
export const fetchContentFilesByCreator = fetchContentFiles;

export const fetchContentFile = async (id: string): Promise<ContentFile> => {
  const { data, error } = await supabase
    .from('content_files')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching content file with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data as ContentFile;
};

export const createContentFile = async (contentFile: CreateContentFileInput): Promise<ContentFile> => {
  const { data, error } = await supabase
    .from('content_files')
    .insert([contentFile])
    .select()
    .single();

  if (error) {
    console.error('Error creating content file:', error);
    throw new Error(error.message);
  }

  return data as ContentFile;
};

// Alias for createContentFile to match the import in FileUploadForm
export const createContentFileRecord = createContentFile;

export const updateContentFile = async (contentFile: ContentFile): Promise<ContentFile> => {
  const { id, ...fileData } = contentFile;
  
  const { data, error } = await supabase
    .from('content_files')
    .update(fileData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating content file with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data as ContentFile;
};

export const deleteContentFile = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('content_files')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting content file with id ${id}:`, error);
    throw new Error(error.message);
  }
};

// Upload file function needed for FileUploadForm
export const uploadFile = async (file: File, creatorId: string): Promise<string> => {
  const filePath = `creator_${creatorId}/${file.name}`;
  
  const { error } = await supabase.storage
    .from('content-files')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }

  return filePath;
};

// Get file URL function needed for ContentFilesList
export const getFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('content-files')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
