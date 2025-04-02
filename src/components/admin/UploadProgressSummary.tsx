
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FileWithProgress } from '@/types/fileUpload';

interface UploadProgressSummaryProps {
  files: FileWithProgress[];
  overallProgress: number;
}

export default function UploadProgressSummary({ 
  files, 
  overallProgress 
}: UploadProgressSummaryProps) {
  return (
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
  );
}
