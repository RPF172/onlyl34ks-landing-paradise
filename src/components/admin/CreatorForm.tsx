
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Creator, CreateCreatorInput, UpdateCreatorInput } from '@/types/creator';
import { creatorSchema, CreatorFormValues } from '@/schemas/creator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreatorFormProps {
  creator?: Creator;
  onSubmit: (data: CreateCreatorInput | UpdateCreatorInput) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export default function CreatorForm({ creator, onSubmit, isLoading, onCancel }: CreatorFormProps) {
  const form = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: creator?.name || '',
      category: creator?.category || '',
      bio: creator?.bio || '',
    },
  });

  const handleSubmit = (data: CreatorFormValues) => {
    if (creator) {
      // If updating an existing creator, include the id
      onSubmit({
        id: creator.id,
        ...data,
      });
    } else {
      // Creating a new creator
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Creator name" {...field} className="bg-onlyl34ks-bg-dark text-white border-onlyl34ks-bg-light/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Category" {...field} className="bg-onlyl34ks-bg-dark text-white border-onlyl34ks-bg-light/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Creator bio" 
                  {...field} 
                  className="bg-onlyl34ks-bg-dark text-white border-onlyl34ks-bg-light/30" 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white">
            {isLoading ? 'Saving...' : creator ? 'Update Creator' : 'Create Creator'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
