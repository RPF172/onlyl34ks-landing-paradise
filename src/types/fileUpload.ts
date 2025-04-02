
export interface FileWithProgress extends File {
  id: string;
  progress: number;
  speed: number;
  timeRemaining: number;
  status: 'queued' | 'uploading' | 'success' | 'error';
  error?: string;
  previewUrl?: string;
  path?: string;
}

export interface BatchFileUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  creatorId?: string;
}

export interface FileItemProps {
  file: FileWithProgress;
  onRemove: (fileId: string) => void;
  onRetry: (fileId: string) => void;
  onCancelUpload: (fileId: string) => void;
}
