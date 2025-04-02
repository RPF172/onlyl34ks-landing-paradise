
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCreators, createCreator, updateCreator, deleteCreator } from '@/services/creatorService';
import { Creator, CreateCreatorInput, UpdateCreatorInput } from '@/types/creator';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import CreatorForm from '@/components/admin/CreatorForm';

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  // Fetch creators
  const { data: creators = [], isLoading, isError } = useQuery({
    queryKey: ['creators'],
    queryFn: fetchCreators,
  });

  // Create creator mutation
  const createMutation = useMutation({
    mutationFn: (creator: CreateCreatorInput) => createCreator(creator),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Creator created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create creator: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update creator mutation
  const updateMutation = useMutation({
    mutationFn: (creator: UpdateCreatorInput) => updateCreator(creator),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      setIsEditDialogOpen(false);
      setSelectedCreator(null);
      toast({
        title: "Success",
        description: "Creator updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update creator: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete creator mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCreator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      setIsDeleteDialogOpen(false);
      setSelectedCreator(null);
      toast({
        title: "Success",
        description: "Creator deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete creator: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateCreator = (data: CreateCreatorInput) => {
    createMutation.mutate(data);
  };

  const handleUpdateCreator = (data: UpdateCreatorInput) => {
    updateMutation.mutate(data);
  };

  const handleDeleteCreator = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container px-4 py-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Creator Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Creator
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-onlyl34ks-card border-onlyl34ks-bg-light/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New Creator</DialogTitle>
              <DialogDescription className="text-onlyl34ks-text-muted">
                Fill out the form below to add a new creator.
              </DialogDescription>
            </DialogHeader>
            <CreatorForm
              onSubmit={handleCreateCreator}
              isLoading={createMutation.isPending}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-onlyl34ks-accent" />
        </div>
      ) : isError ? (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-md">
          An error occurred while loading creators. Please try again.
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-10 text-onlyl34ks-text-muted">
          No creators found. Add your first creator by clicking the button above.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-onlyl34ks-bg-light/10">
                <TableHead className="text-onlyl34ks-text-light">Name</TableHead>
                <TableHead className="text-onlyl34ks-text-light">Category</TableHead>
                <TableHead className="text-onlyl34ks-text-light">Bio</TableHead>
                <TableHead className="text-onlyl34ks-text-light">Created At</TableHead>
                <TableHead className="text-onlyl34ks-text-light text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator) => (
                <TableRow key={creator.id} className="border-b border-onlyl34ks-bg-light/10">
                  <TableCell className="text-white">{creator.name}</TableCell>
                  <TableCell className="text-white">{creator.category}</TableCell>
                  <TableCell className="text-white max-w-xs truncate">
                    {creator.bio || "No bio provided"}
                  </TableCell>
                  <TableCell className="text-onlyl34ks-text-muted">
                    {new Date(creator.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog open={isEditDialogOpen && selectedCreator?.id === creator.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setSelectedCreator(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-onlyl34ks-accent" onClick={() => setSelectedCreator(creator)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-onlyl34ks-card border-onlyl34ks-bg-light/20 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit Creator</DialogTitle>
                          <DialogDescription className="text-onlyl34ks-text-muted">
                            Update creator information.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedCreator && (
                          <CreatorForm
                            creator={selectedCreator}
                            onSubmit={handleUpdateCreator}
                            isLoading={updateMutation.isPending}
                            onCancel={() => {
                              setIsEditDialogOpen(false);
                              setSelectedCreator(null);
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog open={isDeleteDialogOpen && selectedCreator?.id === creator.id} onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setSelectedCreator(null);
                    }}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500" onClick={() => setSelectedCreator(creator)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-onlyl34ks-card border-onlyl34ks-bg-light/20 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-onlyl34ks-text-muted">
                            This will permanently delete {creator.name}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent text-white border-onlyl34ks-bg-light/30 hover:bg-onlyl34ks-bg-light/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteCreator(creator.id)}
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
      )}
    </div>
  );
}
