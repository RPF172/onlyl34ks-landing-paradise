
import { supabase } from '@/integrations/supabase/client';
import { FileWithProgress } from '@/types/fileUpload';

/**
 * Upload file to Supabase storage and track progress
 */
export const uploadFileToSupabase = async (
  file: FileWithProgress, 
  creatorId?: string,
  onProgressUpdate?: (fileId: string, progress: number, speed: number, timeRemaining: number) => void
): Promise<string> => {
  try {
    // Generate file path
    const filePath = `${creatorId ? `creator_${creatorId}` : 'uploads'}/${file.id}_${file.name}`;
    
    // Track upload start time for speed calculation
    const uploadStartTime = Date.now();
    
    // Immediately report start of upload (0%)
    if (onProgressUpdate) {
      onProgressUpdate(file.id, 0, 0, 0);
    }
    
    // Upload the file with valid options
    const { data, error } = await supabase.storage
      .from('content-files')
      .upload(filePath, file, {
        upsert: true
      });
    
    // Since we can't track progress directly with the Supabase JS client,
    // we'll just simulate completion after successful upload
    if (onProgressUpdate) {
      onProgressUpdate(file.id, 100, 0, 0);
    }
    
    if (error) {
      throw error;
    }
    
    console.log('File uploaded successfully:', filePath);
    return filePath;
    
  } catch (error: any) {
    console.error(`Error uploading file ${file.name}:`, error);
    throw error;
  }
};

/**
 * Get public URL for a file in Supabase storage
 */
export const getFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('content-files')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
