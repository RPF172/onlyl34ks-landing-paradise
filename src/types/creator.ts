
export interface Creator {
  id: string;
  name: string;
  category: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCreatorInput {
  name: string;
  category: string;
  bio?: string;
}

export interface UpdateCreatorInput extends CreateCreatorInput {
  id: string;
}
