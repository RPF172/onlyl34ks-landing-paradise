import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchContentFilesByCreator, deleteContentFile, getFileUrl } from '@/services/contentFileService';
import { ContentFile } from '@/types/contentFile';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2, FileIcon, Trash2, ExternalLink, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContentFilesListProps {
  creatorId: string;
}

export default function ContentFilesList({ creatorId }: ContentFilesListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fileToDelete, setFileToDelete] = useState<ContentFile | null>(null);
  
  const { data: files = [], isLoading, isError } = useQuery({
    queryKey: ['contentFiles', creatorId],
    queryFn: () => fetchContentFilesByCreator(creatorId),
  });

  const deleteMutation = useMutation({
    mutationFn: (file: ContentFile) => deleteContentFile(file.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentFiles', creatorId] });
      setFileToDelete(null);
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete file: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-onlyl34ks-accent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/20 text-red-200 p-4 rounded-md">
        An error occurred while loading content files.
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-onlyl34ks-text-muted">
        No content files found for this creator.
      </div>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-onlyl34ks-bg-light/10">
            <TableHead className="text-onlyl34ks-text-light">File Name</TableHead>
            <TableHead className="text-onlyl34ks-text-light">Type</TableHead>
            <TableHead className="text-onlyl34ks-text-light">Size</TableHead>
            <TableHead className="text-onlyl34ks-text-light">Uploaded</TableHead>
            <TableHead className="text-onlyl34ks-text-light text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id} className="border-b border-onlyl34ks-bg-light/10">
              <TableCell className="text-white">{file.file_name}</TableCell>
              <TableCell className="text-white">{file.file_type}</TableCell>
              <TableCell className="text-white">{formatFileSize(file.file_size)}</TableCell>
              <TableCell className="text-onlyl34ks-text-muted">
                {new Date(file.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-onlyl34ks-accent"
                  onClick={() => window.open(getFileUrl(file.file_path), '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-onlyl34ks-accent"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = getFileUrl(file.file_path);
                    link.download = file.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                
                <AlertDialog open={fileToDelete?.id === file.id} onOpenChange={(open) => {
                  if (!open) setFileToDelete(null);
                }}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500"
                      onClick={() => setFileToDelete(file)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-onlyl34ks-card border-onlyl34ks-bg-light/20 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-onlyl34ks-text-muted">
                        This will permanently delete the file "{file.file_name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent text-white border-onlyl34ks-bg-light/30 hover:bg-onlyl34ks-bg-light/10">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          if (fileToDelete) deleteMutation.mutate(fileToDelete);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
