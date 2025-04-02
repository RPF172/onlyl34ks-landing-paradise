
import { supabase } from '@/integrations/supabase/client';
import { FileWithProgress } from '@/types/fileUpload';

export const extractFileMetadata = async (file: File): Promise<{
  file_name: string;
  file_type: string;
  file_size: number;
  metadata?: Record<string, any>;
}> => {
  const metadata: Record<string, any> = {};
  
  try {
    // Basic metadata
    const fileMetadata = {
      file_name: file.name,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size,
      metadata: {}
    };

    // Image-specific metadata
    if (file.type.startsWith('image/')) {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      fileMetadata.metadata = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      };

      URL.revokeObjectURL(img.src);
    }

    // Video-specific metadata
    if (file.type.startsWith('video/')) {
      const video = await new Promise<HTMLVideoElement>((resolve, reject) => {
        const video = document.createElement('video');
        video.onloadedmetadata = () => resolve(video);
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
      });

      fileMetadata.metadata = {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      };

      URL.revokeObjectURL(video.src);
    }

    // Audio-specific metadata
    if (file.type.startsWith('audio/')) {
      const audio = await new Promise<HTMLAudioElement>((resolve, reject) => {
        const audio = document.createElement('audio');
        audio.onloadedmetadata = () => resolve(audio);
        audio.onerror = reject;
        audio.src = URL.createObjectURL(file);
      });

      fileMetadata.metadata = {
        duration: audio.duration
      };

      URL.revokeObjectURL(audio.src);
    }

    return fileMetadata;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {
      file_name: file.name,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size
    };
  }
};

export const uploadFileToSupabase = async (
  file: FileWithProgress, 
  creatorId?: string,
  onProgressUpdate?: (fileId: string, progress: number, speed: number, timeRemaining: number) => void
): Promise<string> => {
  try {
    const filePath = `${creatorId ? `creator_${creatorId}` : 'uploads'}/${file.id}_${file.name}`;
    
    const uploadStartTime = Date.now();
    
    if (onProgressUpdate) {
      onProgressUpdate(file.id, 0, 0, 0);
    }
    
    const { data, error } = await supabase.storage
      .from('content-files')
      .upload(filePath, file, {
        upsert: true
      });
    
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

export const getFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('content-files')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
