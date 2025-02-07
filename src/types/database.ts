export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      files: {
        Row: File;
        Insert: Omit<File, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<File, 'id'>>;
      };
    };
  };
}