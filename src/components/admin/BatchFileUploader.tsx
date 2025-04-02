
import { useState, useCallback, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { FileWithProgress, BatchFileUploaderProps } from '@/types/fileUpload';
import { uploadFileToSupabase } from '@/services/fileUploadService';
import FileUploadItem from './FileUploadItem';
import FileDropzone from './FileDropzone';
import UploadProgressSummary from './UploadProgressSummary';

export default function BatchFileUploader({
  value = [],
  onChange,
  maxFiles = 50,
  maxSize = 5 * 1024 * 1024 * 1024, // 5GB
  disabled = false,
  creatorId,
}: BatchFileUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();
  
  // Initialize files from value prop
  useEffect(() => {
    if (value.length > 0 && files.length === 0) {
      const initializedFiles = value.map(file => ({
        ...file,
        id: crypto.randomUUID(),
        progress: 0,
        speed: 0,
        timeRemaining: 0,
        status: 'queued' as const,
      }));
      setFiles(initializedFiles);
    }
  }, [value, files.length]);

  // Calculate overall progress whenever individual file progress changes
  useEffect(() => {
    if (files.length === 0) {
      setOverallProgress(0);
      return;
    }
    
    const totalProgress = files.reduce((acc, file) => acc + file.progress, 0);
    setOverallProgress(Math.round(totalProgress / files.length));
  }, [files]);

  // Update the form value whenever files change
  useEffect(() => {
    // Convert FileWithProgress back to File before updating form
    onChange(files as File[]);
  }, [files, onChange]);
  
  // Handler for uploading a file to Supabase
  const handleFileUpload = async (file: FileWithProgress) => {
    // Skip if already uploaded or has error
    if (file.status === 'success' || file.status === 'error') return;
    
    // Update file status to uploading
    setFiles(prev => 
      prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );
    
    try {
      // Upload the file and get the file path
      const filePath = await uploadFileToSupabase(
        file,
        creatorId,
        // Progress callback
        (fileId, progress, speed, timeRemaining) => {
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId ? {
                ...f,
                progress,
                speed,
                timeRemaining,
              } : f
            )
          );
        }
      );
      
      // Update file with success status and path
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'success', 
            progress: 100,
            path: filePath
          } : f
        )
      );
      
    } catch (error: any) {
      console.error(`Error uploading file ${file.name}:`, error);
      
      // Update file with error status
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'error', 
            error: error?.message || 'Upload failed' 
          } : f
        )
      );
      
      toast({
        title: "Upload Error",
        description: `Failed to upload ${file.name}: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Don't process if disabled or exceeding max files
    if (disabled) return;
    
    // Generate preview URLs for images
    const newFiles = acceptedFiles.map(file => {
      const fileWithId: FileWithProgress = Object.assign(file, {
        id: crypto.randomUUID(),
        progress: 0,
        speed: 0,
        timeRemaining: 0,
        status: 'queued' as const,
      });
      
      // Create preview for images
      if (file.type && file.type.startsWith('image/')) {
        fileWithId.previewUrl = URL.createObjectURL(file);
      }
      
      return fileWithId;
    });
    
    // Limit number of files
    const totalFiles = [...files, ...newFiles];
    const filesToAdd = totalFiles.slice(0, maxFiles);
    
    setFiles(filesToAdd);
    
    // Start upload for new files
    newFiles.forEach(file => {
      handleFileUpload(file);
    });
  }, [files, disabled, maxFiles, creatorId, toast]);

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      // Revoke any object URLs to avoid memory leaks
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return updatedFiles;
    });
  };

  const handleRetryFile = (fileId: string) => {
    const fileToRetry = files.find(f => f.id === fileId);
    if (fileToRetry) {
      handleFileUpload(fileToRetry);
    }
  };

  const handleCancelUpload = (fileId: string) => {
    // Currently Supabase doesn't support canceling uploads in progress
    // We can only mark it as error in the UI
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId ? 
          { ...file, status: 'error', error: 'Upload cancelled by user' } : 
          file
      )
    );
  };

  return (
    <div className="space-y-4">
      <FileDropzone 
        onDrop={onDrop}
        disabled={disabled}
        maxSize={maxSize}
        maxFiles={maxFiles}
        filesCount={files.length}
      />

      {files.length > 0 && (
        <div className="bg-onlyl34ks-bg-light/10 rounded-lg p-4">
          <UploadProgressSummary 
            files={files}
            overallProgress={overallProgress}
          />

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {files.map((file) => (
                <FileUploadItem
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                  onRetry={handleRetryFile}
                  onCancelUpload={handleCancelUpload}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
