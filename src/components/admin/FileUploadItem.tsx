
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Image, FileText, Film, X, RefreshCw } from 'lucide-react';
import { FileItemProps } from '@/types/fileUpload';
import { formatSize, formatSpeed, formatTime } from '@/utils/fileUtils';

export default function FileUploadItem({ file, onRemove, onRetry, onCancelUpload }: FileItemProps) {
  const getFileIcon = () => {
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
    <div 
      key={file.id} 
      className="bg-onlyl34ks-bg-dark rounded border border-onlyl34ks-bg-light/20 p-3"
    >
      <div className="flex items-center mb-2">
        <div className="mr-3">
          {getFileIcon()}
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
                  onClick={() => onRetry(file.id)}
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
                  onClick={() => onCancelUpload(file.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-onlyl34ks-text-muted"
                onClick={() => onRemove(file.id)}
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
  );
}
