
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, RefreshCw, Upload, CheckCircle, AlertCircle, Image, FileText, Film } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileWithProgress extends File {
  id: string;
  progress: number;
  speed: number;
  timeRemaining: number;
  status: 'queued' | 'uploading' | 'success' | 'error';
  error?: string;
  previewUrl?: string;
  path?: string; // Added path property to store the uploaded file path
}

interface BatchFileUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  creatorId?: string;
}

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
  
  // Function to upload a file to Supabase
  const uploadFileToSupabase = async (file: FileWithProgress) => {
    // Skip if already uploaded or has error
    if (file.status === 'success' || file.status === 'error') return;
    
    // Update file status to uploading
    setFiles(prev => 
      prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );
    
    try {
      // Generate file path - use creatorId if available or fallback to a generic path
      const filePath = `${creatorId ? `creator_${creatorId}` : 'uploads'}/${file.id}_${file.name}`;
      
      // Track upload start time for speed calculation
      const uploadStartTime = Date.now();
      let lastLoaded = 0;
      let lastTime = uploadStartTime;
      
      // Create an XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const now = Date.now();
            const percent = (event.loaded / event.total) * 100;
            const loadDiff = event.loaded - lastLoaded;
            const timeDiff = (now - lastTime) / 1000; // seconds
            
            // Calculate speed (bytes per second)
            const speed = timeDiff > 0 ? loadDiff / timeDiff : 0;
            
            // Calculate time remaining
            const remainingBytes = event.total - event.loaded;
            const timeRemaining = speed > 0 ? remainingBytes / speed : 0;
            
            // Update file with progress info
            setFiles(prevFiles => 
              prevFiles.map(f => 
                f.id === file.id ? {
                  ...f,
                  progress: Math.round(percent),
                  speed: speed,
                  timeRemaining: timeRemaining,
                } : f
              )
            );
            
            // Update for next calculation
            lastLoaded = event.loaded;
            lastTime = now;
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP Error: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Network Error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload Aborted')));
      });
      
      // Upload file using Supabase storage
      const { data, error } = await supabase.storage
        .from('content-files')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      console.log('File uploaded successfully:', filePath);
      
      // Update file with success status and path
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'success', 
            progress: 100,
            path: filePath // Store the file path for database record creation
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
      uploadFileToSupabase(file);
    });
  }, [files, disabled, maxFiles, creatorId, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxSize,
    maxFiles: maxFiles - files.length,
    onDropRejected: (rejections) => {
      console.log('Drop rejected:', rejections);
      // Handle rejections (file too large, too many files)
      rejections.forEach(rejection => {
        const file = rejection.file;
        const errors = rejection.errors.map(e => e.message).join(', ');
        
        // Add file with error status
        setFiles(prev => [
          ...prev, 
          {
            ...Object.assign(file, {
              id: crypto.randomUUID(),
              progress: 0,
              speed: 0,
              timeRemaining: 0,
              status: 'error' as const,
              error: errors,
            })
          }
        ]);
      });
    }
  });

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
      uploadFileToSupabase(fileToRetry);
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

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const formatSpeed = (bytesPerSec: number): string => {
    if (bytesPerSec < 1024) return bytesPerSec.toFixed(2) + ' B/s';
    if (bytesPerSec < 1024 * 1024) return (bytesPerSec / 1024).toFixed(2) + ' KB/s';
    return (bytesPerSec / (1024 * 1024)).toFixed(2) + ' MB/s';
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}m ${secs}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const getFileIcon = (file: FileWithProgress) => {
    // Add null/undefined check for file.type
    if (file.type && file.type.startsWith('image/')) {
      return file.previewUrl ? 
        <img 
          src={file.previewUrl} 
          alt={file.name} 
          className="w-10 h-10 object-cover rounded" 
        /> : 
        <Image className="w-10 h-10 text-gray-400" />;
    }
    if (file.type && file.type.startsWith('video/')) {
      return <Film className="w-10 h-10 text-purple-400" />;
    }
    return <FileText className="w-10 h-10 text-blue-400" />;
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-onlyl34ks-accent bg-onlyl34ks-accent/10' : 'border-onlyl34ks-bg-light/30'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-onlyl34ks-accent hover:bg-onlyl34ks-accent/5'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-onlyl34ks-accent mb-4" />
        <p className="text-onlyl34ks-text-light text-lg font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-onlyl34ks-text-muted text-sm mb-3">
          or click to select files
        </p>
        <p className="text-onlyl34ks-text-muted text-xs">
          Maximum {maxFiles} files. Up to {formatSize(maxSize)} per file.
        </p>
      </div>

      {files.length > 0 && (
        <div className="bg-onlyl34ks-bg-light/10 rounded-lg p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-onlyl34ks-text-light">
                Overall progress {overallProgress}%
              </span>
              <span className="text-sm text-onlyl34ks-text-muted">
                {files.filter(f => f.status === 'success').length}/{files.length} complete
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="bg-onlyl34ks-bg-dark rounded border border-onlyl34ks-bg-light/20 p-3"
                >
                  <div className="flex items-center mb-2">
                    <div className="mr-3">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-onlyl34ks-text-light truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 ml-2">
                          {file.status === 'error' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-onlyl34ks-accent"
                              onClick={() => handleRetryFile(file.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span className="sr-only">Retry</span>
                            </Button>
                          )}
                          {file.status === 'uploading' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-red-400"
                              onClick={() => handleCancelUpload(file.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-onlyl34ks-text-muted"
                            onClick={() => handleRemoveFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-onlyl34ks-text-muted">
                        <span>{formatSize(file.size)}</span>
                        {file.status === 'uploading' && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{formatSpeed(file.speed)}</span>
                            <span className="mx-1">•</span>
                            <span>{formatTime(file.timeRemaining)} remaining</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 mr-3">
                      <Progress value={file.progress} className="h-1" />
                    </div>
                    <div className="w-8 text-xs font-medium">
                      {file.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : file.status === 'error' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        `${file.progress}%`
                      )}
                    </div>
                  </div>
                  
                  {file.error && (
                    <p className="mt-2 text-xs text-red-400">
                      Error: {file.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
