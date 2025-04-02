
import { supabase } from '@/integrations/supabase/client';
import { FileWithProgress } from '@/types/fileUpload';

/**
 * Extract metadata from a file based on its type
 */
export const extractFileMetadata = async (file: File): Promise<Record<string, any>> => {
  const metadata: Record<string, any> = {};
  
  try {
    // Basic metadata that applies to all files
    metadata.size = file.size;
    metadata.type = file.type;
    metadata.name = file.name;
    metadata.lastModified = file.lastModified;

    // Extract metadata for images
    if (file.type.startsWith('image/')) {
      const imageMetadata = await extractImageMetadata(file);
      Object.assign(metadata, imageMetadata);
    }
    
    // Extract metadata for videos
    if (file.type.startsWith('video/')) {
      const videoMetadata = await extractVideoMetadata(file);
      Object.assign(metadata, videoMetadata);
    }
    
    // Extract metadata for audio
    if (file.type.startsWith('audio/')) {
      const audioMetadata = await extractAudioMetadata(file);
      Object.assign(metadata, audioMetadata);
    }
    
    return metadata;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return metadata; // Return partial metadata even if extraction fails
  }
};

/**
 * Extract metadata from an image file
 */
const extractImageMetadata = async (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve) => {
    const metadata: Record<string, any> = {};
    const img = new Image();
    
    img.onload = () => {
      metadata.width = img.width;
      metadata.height = img.height;
      metadata.aspectRatio = img.width / img.height;
      
      // Clean up object URL
      URL.revokeObjectURL(img.src);
      resolve(metadata);
    };
    
    img.onerror = () => {
      // Clean up object URL
      URL.revokeObjectURL(img.src);
      resolve(metadata);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Extract metadata from a video file
 */
const extractVideoMetadata = async (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve) => {
    const metadata: Record<string, any> = {};
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      metadata.width = video.videoWidth;
      metadata.height = video.videoHeight;
      metadata.duration = video.duration;
      metadata.aspectRatio = video.videoWidth / video.videoHeight;
      
      // Clean up object URL
      URL.revokeObjectURL(video.src);
      resolve(metadata);
    };
    
    video.onerror = () => {
      // Clean up object URL
      URL.revokeObjectURL(video.src);
      resolve(metadata);
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Extract metadata from an audio file
 */
const extractAudioMetadata = async (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve) => {
    const metadata: Record<string, any> = {};
    const audio = document.createElement('audio');
    
    audio.onloadedmetadata = () => {
      metadata.duration = audio.duration;
      
      // Clean up object URL
      URL.revokeObjectURL(audio.src);
      resolve(metadata);
    };
    
    audio.onerror = () => {
      // Clean up object URL
      URL.revokeObjectURL(audio.src);
      resolve(metadata);
    };
    
    audio.src = URL.createObjectURL(file);
  });
};

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
