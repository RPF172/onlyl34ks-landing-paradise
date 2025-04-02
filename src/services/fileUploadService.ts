
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
    let lastLoaded = 0;
    let lastTime = uploadStartTime;
    
    // Upload file using Supabase storage
    const { data, error } = await supabase.storage
      .from('content-files')
      .upload(filePath, file, {
        onUploadProgress: (event) => {
          if (event.loaded && event.total && onProgressUpdate) {
            const now = Date.now();
            const percent = (event.loaded / event.total) * 100;
            const loadDiff = event.loaded - lastLoaded;
            const timeDiff = (now - lastTime) / 1000; // seconds
            
            // Calculate speed (bytes per second)
            const speed = timeDiff > 0 ? loadDiff / timeDiff : 0;
            
            // Calculate time remaining
            const remainingBytes = event.total - event.loaded;
            const timeRemaining = speed > 0 ? remainingBytes / speed : 0;
            
            // Update progress through callback
            onProgressUpdate(file.id, Math.round(percent), speed, timeRemaining);
            
            // Update for next calculation
            lastLoaded = event.loaded;
            lastTime = now;
          }
        }
      });
    
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
