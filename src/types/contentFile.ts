
export interface ContentFile {
  id: string;
  creator_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContentFileInput {
  creator_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  is_preview?: boolean;
}

// Extend the File interface to include properties needed for upload tracking
declare global {
  interface File {
    id?: string;
    status?: string;
    path?: string;
  }
}
