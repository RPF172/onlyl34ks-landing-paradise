
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
  bio?: string | null;
}

export interface UpdateCreatorInput {
  id: string;
  name: string;
  category: string;
  bio?: string | null;
}
