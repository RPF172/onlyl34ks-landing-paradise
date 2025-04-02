
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

// Extend the File interface to include properties we need
interface FileWithUploadStatus extends File {
  id: string;
  status?: string;
  path?: string; // Add path property to store the uploaded file path
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
    mutationFn: async (files: FileWithUploadStatus[]) => {
      setIsUploading(true);
      
      try {
        console.log('Creating content file records for:', files.length, 'files', 'with creatorId:', creatorId);
        // Files are already uploaded by the BatchFileUploader
        // We just need to create the database records for each file
        const results: ContentFile[] = [];
        
        for (const file of files) {
          // Get the file path from the successful uploads
          if (!file.path) {
            console.error('Missing file path for:', file.name);
            throw new Error(`Missing file path for ${file.name}`);
          }

          console.log('Creating content file record for:', file.name, 'with path:', file.path);

          // Create content file record
          const contentFileInput: CreateContentFileInput = {
            creator_id: creatorId,
            file_name: file.name, // Ensure we're using the actual file name
            file_path: file.path,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size,
            is_preview: false, // Default to not a preview file
          };

          try {
            console.log('Sending content file input:', JSON.stringify(contentFileInput));
            const contentFile = await createContentFile(contentFileInput);
            console.log('Content file record created:', contentFile);
            results.push(contentFile);
          } catch (error) {
            console.error('Error creating content file record:', error);
            throw error;
          }
        }
        
        console.log('Successfully created', results.length, 'content file records');
        return results;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (uploadedFiles: ContentFile[]) => {
      console.log('Mutation successful, uploaded files:', uploadedFiles.length);
      form.reset();
      onSuccess();
      toast({
        title: "Success",
        description: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
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

    console.log('Form submitted with files:', data.files.length);
    
    // Filter out files that weren't successfully uploaded
    const successfullyUploadedFiles = (data.files as FileWithUploadStatus[]).filter((file) => {
      console.log(`File ${file.name} status: ${file.status}, path: ${file.path}`);
      return file.status === 'success' && file.path;
    });

    console.log('Successfully uploaded files:', successfullyUploadedFiles.length);
    
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
