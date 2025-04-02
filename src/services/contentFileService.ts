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
    // Validate required fields with fallbacks
    if (!contentFile.creator_id) {
      throw new Error('creator_id is required');
    }
    
    if (!contentFile.file_path) {
      throw new Error('file_path is required');
    }

    // Add fallbacks for file_name
    if (!contentFile.file_name) {
      console.log('File name is missing, using generated UUID as fallback');
      contentFile.file_name = `file_${crypto.randomUUID().slice(0, 8)}`;
    }

    // Add fallbacks for file_type if missing
    if (!contentFile.file_type) {
      console.log('File type is missing, using default type as fallback');
      contentFile.file_type = 'application/octet-stream';
    }

    // Ensure file_size is set
    if (typeof contentFile.file_size !== 'number') {
      console.log('File size is missing or invalid, using 0 as fallback');
      contentFile.file_size = 0;
    }

    // Ensure metadata is an object if it exists
    if (contentFile.metadata && typeof contentFile.metadata !== 'object') {
      console.log('Metadata is not an object, using empty object as fallback');
      contentFile.metadata = {};
    }

    // Log the final content file data before inserting
    console.log('Final content file data to insert:', JSON.stringify(contentFile));
    
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
