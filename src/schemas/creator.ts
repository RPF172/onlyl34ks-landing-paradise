
import { z } from 'zod';

export const creatorSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50),
  category: z.string().min(2, { message: 'Category must be at least 2 characters' }).max(30),
  bio: z.string().optional(),
});

export type CreatorFormValues = z.infer<typeof creatorSchema>;
