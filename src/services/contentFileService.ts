
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
  console.log('Creating content file with data:', contentFile);
  
  try {
    // Validate required fields
    if (!contentFile.creator_id) {
      throw new Error('creator_id is required');
    }
    
    if (!contentFile.file_path) {
      throw new Error('file_path is required');
    }
    
    const { data, error } = await supabase
      .from('content_files')
      .insert([contentFile])
      .select()
      .single();

    if (error) {
      console.error('Error creating content file:', error);
      throw new Error(error.message);
    }

    console.log('Content file created successfully:', data);
    return data as ContentFile;
  } catch (err) {
    console.error('Error in createContentFile function:', err);
    throw err;
  }
};

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

export const uploadFile = async (file: File, creatorId: string): Promise<string> => {
  const filePath = `creator_${creatorId}/${crypto.randomUUID()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('content-files')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }

  return filePath;
};

export const getFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('content-files')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
