
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
