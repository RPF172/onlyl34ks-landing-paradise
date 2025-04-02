
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { createContentFile } from '@/services/contentFileService';
import { extractFileMetadata } from '@/services/fileUploadService';
import { useToast } from '@/hooks/use-toast';
import BatchFileUploader from './BatchFileUploader';
import { ContentFile, CreateContentFileInput } from '@/types/contentFile';

interface FileUploadFormProps {
  creatorId: string;
  onSuccess: () => void;
}

interface FileUploadFormValues {
  files: File[];
}

export default function FileUploadForm({ creatorId, onSuccess }: FileUploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FileUploadFormValues>({
    defaultValues: {
      files: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      setIsUploading(true);
      
      try {
        const results: ContentFile[] = [];
        
        for (const file of files) {
          if (!file.path) {
            console.error('Missing file path for:', file.name);
            throw new Error(`Missing file path for ${file.name}`);
          }

          const fileMetadata = await extractFileMetadata(file);

          const contentFileInput: CreateContentFileInput = {
            creator_id: creatorId,
            file_name: fileMetadata.file_name,
            file_path: file.path,
            file_type: fileMetadata.file_type,
            file_size: fileMetadata.file_size,
            is_preview: false,
            metadata: fileMetadata.metadata
          };

          try {
            const contentFile = await createContentFile(contentFileInput);
            results.push(contentFile);
          } catch (error) {
            console.error('Error creating content file record:', error);
            throw error;
          }
        }
        
        return results;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (uploadedFiles: ContentFile[]) => {
      form.reset();
      onSuccess();
      toast({
        title: "Success",
        description: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create file records: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FileUploadFormValues) => {
    if (!data.files || data.files.length === 0) {
      toast({
        title: "Error",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    const successfullyUploadedFiles = data.files.filter((file) => 
      file.status === 'success' && file.path
    );

    if (successfullyUploadedFiles.length === 0) {
      toast({
        title: "Error",
        description: "No files were successfully uploaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(successfullyUploadedFiles);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Files</FormLabel>
              <BatchFileUploader
                value={field.value}
                onChange={field.onChange}
                maxFiles={50}
                maxSize={5 * 1024 * 1024 * 1024} // 5GB
                disabled={isUploading || mutation.isPending}
                creatorId={creatorId}
              />
              <FormDescription className="text-onlyl34ks-text-muted">
                Upload content files for this creator (images, documents, videos, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isUploading || mutation.isPending || form.watch("files").length === 0} 
          className="bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white"
        >
          {isUploading || mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Records...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Create File Records
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
