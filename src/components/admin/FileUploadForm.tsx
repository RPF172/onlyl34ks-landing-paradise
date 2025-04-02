
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadFile, createContentFile } from '@/services/contentFileService';
import { useToast } from '@/hooks/use-toast';

interface FileUploadFormProps {
  creatorId: string;
  onSuccess: () => void;
}

interface FileUploadFormValues {
  file: FileList;
}

export default function FileUploadForm({ creatorId, onSuccess }: FileUploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FileUploadFormValues>({
    defaultValues: {},
  });

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      try {
        // Step 1: Upload the file to storage
        const filePath = await uploadFile(file, creatorId);
        
        // Step 2: Create content file record in the database
        return await createContentFile({
          creator_id: creatorId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        });
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      form.reset();
      onSuccess();
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to upload file: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FileUploadFormValues) => {
    if (!data.file || data.file.length === 0) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(data.file[0]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <input
                  type="file"
                  onChange={(e) => onChange(e.target.files)}
                  {...rest}
                  className="block w-full text-white file:mr-4 file:py-2 file:px-4 
                    file:rounded-md file:border-0 file:bg-onlyl34ks-accent 
                    file:text-white hover:file:bg-onlyl34ks-accent-dark
                    bg-onlyl34ks-bg-dark border border-onlyl34ks-bg-light/30 rounded-md"
                />
              </FormControl>
              <FormDescription className="text-onlyl34ks-text-muted">
                Upload content files for this creator (images, documents, videos, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isUploading || mutation.isPending} 
          className="bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white"
        >
          {isUploading || mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
