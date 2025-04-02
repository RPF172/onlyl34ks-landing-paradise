
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentFile } from "@/types/contentFile";
import { deleteContentFile, updateContentFile } from "@/services/contentFileService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Download, Eye } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface ContentFileTableProps {
  files: ContentFile[];
  creatorId: string;
}

export default function ContentFileTable({ files, creatorId }: ContentFileTableProps) {
  const [fileToDelete, setFileToDelete] = useState<ContentFile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation to delete a content file
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: async (file: ContentFile) => {
      // First delete the file from storage
      const { error: storageError } = await supabase.storage
        .from("content-files")
        .remove([`creator_${file.creator_id}/${file.file_name}`]);

      if (storageError) {
        throw new Error(`Failed to delete file from storage: ${storageError.message}`);
      }

      // Then delete the database record
      await deleteContentFile(file.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentFiles", creatorId] });
      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      });
      setFileToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error Deleting File",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to toggle is_preview
  const { mutate: togglePreview } = useMutation({
    mutationFn: async (file: ContentFile) => {
      const updatedFile = {
        ...file,
        is_preview: !file.is_preview,
      };
      await updateContentFile(updatedFile);
      return updatedFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentFiles", creatorId] });
      toast({
        title: "Preview Status Updated",
        description: "The file preview status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Preview Status",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Handle download file
  const handleDownload = async (file: ContentFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("content-files")
        .download(`creator_${file.creator_id}/${file.file_name}`);

      if (error) throw error;

      // Create a URL for the blob and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
      console.error("Download error:", error);
    }
  };

  if (files.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No files uploaded yet.</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.file_name}</TableCell>
              <TableCell>{file.file_type}</TableCell>
              <TableCell>{formatFileSize(file.file_size)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={file.is_preview} 
                    onCheckedChange={() => togglePreview(file)} 
                  />
                  <span className="text-sm text-muted-foreground">
                    {file.is_preview ? "Yes" : "No"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(file.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDownload(file)}
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setFileToDelete(file)}
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the file "{file.file_name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMutate(file)}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
