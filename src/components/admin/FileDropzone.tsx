
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { formatSize } from '@/utils/fileUtils';
import { FileWithProgress } from '@/types/fileUpload';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  disabled?: boolean;
  maxSize?: number;
  maxFiles?: number;
  filesCount?: number;
}

export default function FileDropzone({ 
  onDrop, 
  disabled = false, 
  maxSize = 5 * 1024 * 1024 * 1024, 
  maxFiles = 50,
  filesCount = 0
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxSize,
    maxFiles: maxFiles - filesCount,
    onDropRejected: (rejections) => {
      console.log('Drop rejected:', rejections);
      // This is handled by the parent component
    }
  });

  return (
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
  );
}
